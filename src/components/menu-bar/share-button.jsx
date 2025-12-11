import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import Button from '../button/button.jsx';

import loadingIcon from './share-loading.svg';
import styles from './share-button.css';

const getProjectThumbnail = () => new Promise(resolve => {
    window.vm.renderer.requestSnapshot(uri => {
        resolve(uri);
    });
});
const getProjectUri = () => new Promise(resolve => {
    window.vm.saveProjectSb3().then(blob => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = element => {
            resolve(element.target.result);
        };
        reader.readAsDataURL(blob);
    }))
        .then(resolve);
});

const isUploadAvailable = async () => {
    let res = null;
    try {
        res = await fetch('https://projects.penguinmod.com/api/v1/projects/canuploadprojects').then(res => res.json());
    } catch {
        // failed to fetch entirely
        return false;
    }
    return res.canUpload;
};

class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleMessageEvent',
            'wrapperEventHandler',
            'onUploadProject'
        ]);
        this.state = {
            loading: false,
            imageUri: ''
        };
    }
    componentDidMount() {
        window.addEventListener('message', this.wrapperEventHandler);
    }
    componentWillUnmount() {
        window.removeEventListener('message', this.wrapperEventHandler);
    }

    wrapperEventHandler(e) {
        this.handleMessageEvent(e);
    }
    async handleMessageEvent(e) {
        if (!e.origin.startsWith(`https://penguinmod.com`)) {
            return;
        }

        if (!e.data.p4) {
            return;
        }

        const packagerData = e.data.p4;
        if (packagerData.type !== 'validate') {
            return;
        }

        const imageUri = this.state.imageUri;
        e.source.postMessage({
            p4: {
                type: 'image',
                uri: imageUri
            }
        }, e.origin);
        const projectUri = await getProjectUri();
        e.source.postMessage({
            p4: {
                type: 'project',
                uri: projectUri
            }
        }, e.origin);

        e.source.postMessage({
            p4: {
                type: 'finished'
            }
        }, e.origin);
    }
    async onUploadProject() {
        if (this.state.loading) return;
        if (!window.vm) return;
        if (!window.vm.runtime) return;
        if (!window.vm.renderer) return;

        // get the project thumbnail
        await new Promise((resolve) => {
            getProjectThumbnail().then(dataUrl => {
                this.setState({
                    imageUri: dataUrl
                });
                resolve();
            });
            window.vm.renderer.draw(); // force the callback to run
            setTimeout(() => {
                window.vm.renderer.draw(); // force the callback to run
            }, 50);
            setTimeout(() => {
                window.vm.renderer.draw(); // force the callback to run
            }, 100);
        });

        this.setState({
            loading: true
        });
        isUploadAvailable().then(available => {
            this.setState({
                loading: false
            });
            if (!available) {
                // error?
                console.warn('Project Server did not respond. Uploading is not available.');
                alert('Uploading is currently unavailable. Please wait for the server to be restored.');
                return;
            }

            const isEdit = this.props.usernameLoggedIn
                && this.props.extraProjectInfo?.author === this.props.username;

            let editPiece = '';
            let remixPiece = '';
            const id = location.hash.replace('#', '');
            if (this.props.extraProjectInfo?.isRemix) {
                remixPiece = `&remix=${id}`;
            }

            let targetPage = 'upload';
            if (isEdit) {
                targetPage = 'edit';
                editPiece = `&id=${id}`;
            }

            const projectTitle = encodeURIComponent(this.props.projectTitle);
            const url = location.origin;
            window.open(`https://penguinmod.com/${targetPage}?name=${projectTitle}${editPiece}${remixPiece}&external=${url}`, '_blank');
        });
    }
    render() {
        const isRemix = this.props.extraProjectInfo?.isRemix;
        const isEdit = this.props.usernameLoggedIn
            && this.props.extraProjectInfo?.author === this.props.username;
        return (
            <Button
                className={classNames(
                    this.props.className,
                    styles.shareButton,
                    { [styles.shareButtonIsShared]: this.props.isShared },
                    { [styles.disabled]: this.state.loading },
                )}
                onClick={this.onUploadProject}
            >
                <div className={classNames(styles.shareContent)}>
                    {isEdit ? <FormattedMessage
                            defaultMessage="Upload Edits"
                            description="Text for uploading edits for projects on PenguinMod"
                            id="pm.menuBar.pmedit"
                        /> :
                        (isRemix ?
                            <FormattedMessage
                                defaultMessage="Remix"
                                description="Menu bar item for remixing"
                                id="gui.menuBar.remix"
                            /> :
                            <FormattedMessage
                                defaultMessage="Upload"
                                description="Label for project share button"
                                id="pm.menuBar.pmshare"
                            />)}
                    {this.state.loading ? (
                        <img
                            className={classNames(styles.icon)}
                            draggable={false}
                            src={loadingIcon}
                            height={20}
                            width={20}
                        />
                    ) : null}
                </div>
            </Button>
        );
    }
}

ShareButton.propTypes = {
    className: PropTypes.string,
    isShared: PropTypes.bool,
    projectTitle: PropTypes.string,
    extraProjectInfo: PropTypes.shape({
        accepted: PropTypes.bool,
        isRemix: PropTypes.bool,
        remixId: PropTypes.number,
        tooLarge: PropTypes.bool,
        author: PropTypes.string,
        releaseDate: PropTypes.shape(Date),
        isUpdated: PropTypes.bool
    }),
    username: PropTypes.string,
    usernameLoggedIn: PropTypes.bool
};

const mapStateToProps = state => ({
    projectTitle: state.scratchGui.projectTitle,
    extraProjectInfo: state.scratchGui.tw.extraProjectInfo,
    username: state.scratchGui.tw.username,
    usernameLoggedIn: state.scratchGui.tw.usernameLoggedIn
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ShareButton));
