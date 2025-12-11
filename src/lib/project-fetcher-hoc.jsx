import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import bindAll from 'lodash.bindall';
import { connect } from 'react-redux';
import JSZip from 'jszip';
import { protobufToJson } from 'pmp-protobuf'

import { setProjectUnchanged } from '../reducers/project-changed';
import {
    LoadingStates,
    getIsCreatingNew,
    getIsFetchingWithId,
    getIsLoading,
    getIsShowingProject,
    onFetchedProjectData,
    projectError,
    setProjectId
} from '../reducers/project-state';
import {
    activateTab,
    BLOCKS_TAB_INDEX
} from '../reducers/editor-tab';

import log from './log';
import storage from './storage';

import { MISSING_PROJECT_ID } from './tw-missing-project';
import VM from 'scratch-vm';
import * as progressMonitor from '../components/loader/tw-progress-monitor';

// TW: Temporary hack for project tokens
const fetchProjectToken = projectId => {
    if (projectId === '0') {
        return Promise.resolve(null);
    }
    // Parse ?token=abcdef
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('token')) {
        return Promise.resolve(searchParams.get('token'));
    }
    // Parse #1?token=abcdef
    const hashParams = new URLSearchParams(location.hash.split('?')[1]);
    if (hashParams.has('token')) {
        return Promise.resolve(hashParams.get('token'));
    }
    return fetch(`https://projects.penguinmod.com/api/v1/projects/getproject?projectID=${projectId}&requestType=metadata`)
        .then(r => {
            if (!r.ok) return null;
            return r.json();
        })
        .then(dataOrNull => {
            const token = dataOrNull ? dataOrNull.id : null;
            return token;
        })
        .catch(err => {
            log.error(err);
            return null;
        });
};

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectFetcherHOC = function (WrappedComponent) {
    class ProjectFetcherComponent extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, [
                'fetchProject'
            ]);
            storage.setProjectHost(props.projectHost);
            storage.setProjectToken(props.projectToken);
            storage.setAssetHost(props.assetHost);
            storage.setTranslatorFunction(props.intl.formatMessage);
            // props.projectId might be unset, in which case we use our default;
            // or it may be set by an even higher HOC, and passed to us.
            // Either way, we now know what the initial projectId should be, so
            // set it in the redux store.
            if (
                props.projectId !== '' &&
                props.projectId !== null &&
                typeof props.projectId !== 'undefined'
            ) {
                this.props.setProjectId(props.projectId.toString());
            }
        }
        componentDidUpdate(prevProps) {
            if (prevProps.projectHost !== this.props.projectHost) {
                storage.setProjectHost(this.props.projectHost);
            }
            if (prevProps.projectToken !== this.props.projectToken) {
                storage.setProjectToken(this.props.projectToken);
            }
            if (prevProps.assetHost !== this.props.assetHost) {
                storage.setAssetHost(this.props.assetHost);
            }
            if (this.props.isFetchingWithId && !prevProps.isFetchingWithId) {
                this.fetchProject(this.props.reduxProjectId, this.props.loadingState);
            }
            if (this.props.isShowingProject && !prevProps.isShowingProject) {
                this.props.onProjectUnchanged();
            }
            if (this.props.isShowingProject && (prevProps.isLoadingProject || prevProps.isCreatingNew)) {
                this.props.onActivateTab(BLOCKS_TAB_INDEX);
            }
        }
        fetchProject(projectId, loadingState) {
            // tw: clear and stop the VM before fetching
            // these will also happen later after the project is fetched, but fetching may take a while and
            // the project shouldn't be running while fetching the new project
            this.props.vm.clear();
            this.props.vm.stop();

            // pm: clear url params when fetching if the project ID is 'default'
            if (
                (loadingState === "FETCHING_NEW_DEFAULT") && (projectId == 0 || projectId === null)
            ) {
                this.props.vm.setFramerate(30);
                this.props.vm.setRuntimeOptions({
                    disableDirectionClamping: false,
                    dangerousOptimizations: false,
                    disableOffscreenRendering: false,
                    fencing: true,
                    maxClones: 300,
                    miscLimits: true
                });
            }
            let assetPromise;
            // In case running in node...
            let projectUrl = typeof URLSearchParams === 'undefined' ?
                null :
                new URLSearchParams(location.search).get('project_url');
            if (projectUrl) {
                if (!projectUrl.startsWith('http:') && !projectUrl.startsWith('https:')) {
                    projectUrl = `https://${projectUrl}`;
                }
                assetPromise = progressMonitor.fetchWithProgress(projectUrl)
                    .then(r => {
                        if (this.props.vm.runtime.renderer?.setPrivateSkinAccess)
                            this.props.vm.runtime.renderer.setPrivateSkinAccess(false);
                        if (!r.ok) {
                            throw new Error(`Request returned status ${r.status}`);
                        }
                        return r.arrayBuffer();
                    })
                    .then(buffer => ({ data: buffer }));
            } else {
                // patch for default project
                if (projectId === '0') {
                    storage.setProjectToken(projectId);
                    assetPromise = storage.load(storage.AssetType.Project, projectId, storage.DataFormat.JSON);
                } else {
                    projectUrl = `https://projects.penguinmod.com/api/v1/projects/getprojectwrapper?safe=true&projectId=${projectId}`;
                    assetPromise = progressMonitor.fetchWithProgress(projectUrl)
                        .then(async r => {
                            if (this.props.vm.runtime.renderer?.setPrivateSkinAccess)
                                this.props.vm.runtime.renderer.setPrivateSkinAccess(false);
                            if (!r.ok) {
                                throw new Error(`Request returned status ${r.status}`);
                            }
                            const project = await r.json();

                            const json = protobufToJson(new Uint8Array(project.project.data));

                            // now get the assets
                            let zip = new JSZip();
                            zip.file("project.json", JSON.stringify(json));
                            
                            if (typeof project.assets !== 'object') {
                                alert('No assets were returned. This error is temporary and should not be reported.');
                                throw new TypeError('Invalid type given inside the assets list');
                            }
                            for (const asset of project.assets) {
                                zip.file(asset.id, new Uint8Array(asset.buffer.data).buffer);
                            }

                            const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });

                            return arrayBuffer;
                        })
                        .then(buffer => ({ data: buffer }))
                        .catch(error => {
                            console.log(error)
                        })
                }
            }

            return assetPromise
                .then(projectAsset => {
                    // tw: If the project data appears to be HTML, then the result is probably an nginx 404 page,
                    // and the "missing project" project should be loaded instead.
                    // See: https://projects.scratch.mit.edu/9999999999999999999999
                    if (projectAsset && projectAsset.data) {
                        const firstChar = projectAsset.data[0];
                        if (firstChar === '<' || firstChar === '<'.charCodeAt(0)) {
                            return storage.load(storage.AssetType.Project, MISSING_PROJECT_ID, storage.DataFormat.JSON);
                        }
                    }
                    return projectAsset;
                })
                .then(projectAsset => {
                    if (projectAsset) {
                        this.props.onFetchedProjectData(projectAsset.data, loadingState);
                    } else {
                        // pm: Failed to grab data, use the "fetch" API as a backup
                        // we shouldnt be interrupted by the fetch replacement in tw-progress-monitor
                        // as it uses projects.scratch.mit.edu still
                        fetch(projectUrl).then(async res => {
                            if (!res.ok) {
                                // Treat failure to load as an error
                                // Throw to be caught by catch later on
                                throw new Error('Could not find project; ' + projectUrl);
                            }

                            const project = await res.json();
                            const json = protobufToJson(new Uint8Array(project.project.data));

                            // now get the assets
                            let zip = new JSZip();
                            zip.file("project.json", JSON.stringify(json));
                            
                            if (typeof project.assets !== 'object') {
                                alert('No assets were returned. This error is temporary and should not be reported.');
                                throw new TypeError('Invalid type given inside the assets list');
                            }
                            for (const asset of project.assets) {
                                zip.file(asset.id, new Uint8Array(asset.buffer.data).buffer);
                            }

                            const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
                            this.props.onFetchedProjectData(arrayBuffer, loadingState);
                        }).catch(err => {
                            throw new Error('Could not find project; ' + err);
                        })
                    }
                })
                .catch(err => {
                    this.props.onError(err);
                    log.error(err);
                });
        }
        render() {
            const {
                /* eslint-disable no-unused-vars */
                assetHost,
                intl,
                isLoadingProject: isLoadingProjectProp,
                loadingState,
                onActivateTab,
                onError: onErrorProp,
                onFetchedProjectData: onFetchedProjectDataProp,
                onProjectUnchanged,
                projectHost,
                projectId,
                reduxProjectId,
                setProjectId: setProjectIdProp,
                /* eslint-enable no-unused-vars */
                isFetchingWithId: isFetchingWithIdProp,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    fetchingProject={isFetchingWithIdProp}
                    {...componentProps}
                />
            );
        }
    }
    ProjectFetcherComponent.propTypes = {
        assetHost: PropTypes.string,
        canSave: PropTypes.bool,
        intl: intlShape.isRequired,
        isCreatingNew: PropTypes.bool,
        isFetchingWithId: PropTypes.bool,
        isLoadingProject: PropTypes.bool,
        isShowingProject: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onActivateTab: PropTypes.func,
        onError: PropTypes.func,
        onFetchedProjectData: PropTypes.func,
        onProjectUnchanged: PropTypes.func,
        projectHost: PropTypes.string,
        projectToken: PropTypes.string,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        setProjectId: PropTypes.func,
        vm: PropTypes.instanceOf(VM)
    };
    ProjectFetcherComponent.defaultProps = {
        assetHost: 'https://assets.scratch.mit.edu',
        projectHost: 'https://projects.scratch.mit.edu'
    };

    const mapStateToProps = state => ({
        isCreatingNew: getIsCreatingNew(state.scratchGui.projectState.loadingState),
        isFetchingWithId: getIsFetchingWithId(state.scratchGui.projectState.loadingState),
        isLoadingProject: getIsLoading(state.scratchGui.projectState.loadingState),
        isShowingProject: getIsShowingProject(state.scratchGui.projectState.loadingState),
        loadingState: state.scratchGui.projectState.loadingState,
        reduxProjectId: state.scratchGui.projectState.projectId,
        vm: state.scratchGui.vm
    });
    const mapDispatchToProps = dispatch => ({
        onActivateTab: tab => dispatch(activateTab(tab)),
        onError: error => dispatch(projectError(error)),
        onFetchedProjectData: (projectData, loadingState) =>
            dispatch(onFetchedProjectData(projectData, loadingState)),
        setProjectId: projectId => dispatch(setProjectId(projectId)),
        onProjectUnchanged: () => dispatch(setProjectUnchanged())
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(ProjectFetcherComponent));
};

export {
    ProjectFetcherHOC as default
};
