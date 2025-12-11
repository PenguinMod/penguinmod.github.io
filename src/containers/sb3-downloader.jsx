import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState, setProjectTitle} from '../reducers/project-title';
import downloadBlob from '../lib/download-blob';
import {setProjectUnchanged} from '../reducers/project-changed';
import {showStandardAlert, showAlertWithTimeout} from '../reducers/alerts';
import {setFileHandle} from '../reducers/tw';
import FileSystemAPI from '../lib/tw-filesystem-api';
import {getIsShowingProject} from '../reducers/project-state';
import log from '../lib/log';

// from sb-file-uploader-hoc.jsx
const getProjectTitleFromFilename = fileInputFilename => {
    if (!fileInputFilename) return '';
    // only parse title with valid scratch project extensions
    // (.sb, .sb2, .sb3, and .pm)
    const matches = fileInputFilename.match(/^(.*)(\.sb[23]?|\.pm|\.pmp)$/);
    if (!matches) return '';
    return matches[1].substring(0, 100); // truncate project title to max 100 chars
};

/**
 * @param {Uint8Array[]} arrays List of byte arrays
 * @returns {number} Total length of the arrays
 */
const getLengthOfByteArrays = arrays => {
    let length = 0;
    for (let i = 0; i < arrays.length; i++) {
        length += arrays[i].byteLength;
    }
    return length;
};

/**
 * @param {Uint8Array[]} arrays List of byte arrays
 * @returns {Uint8Array} One big array containing all of the little arrays in order.
 */
const concatenateByteArrays = arrays => {
    const totalLength = getLengthOfByteArrays(arrays);
    const newArray = new Uint8Array(totalLength);
    let p = 0;
    for (let i = 0; i < arrays.length; i++) {
        newArray.set(arrays[i], p);
        p += arrays[i].byteLength;
    }
    return newArray;
};

/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3Downloader>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3Downloader>
 */
class SB3Downloader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadProject',
            'saveAsNew',
            'saveToLastFile',
            'saveToLastFileOrNew',
            'saveAsFolder'
        ]);
    }
    startedSaving () {
        this.props.onShowSavingAlert();
    }
    finishedSaving () {
        this.props.onProjectUnchanged();
        this.props.onShowSaveSuccessAlert();
        if (this.props.onSaveFinished) {
            this.props.onSaveFinished();
        }
    }
    downloadProject () {
        if (!this.props.canSaveProject) {
            return;
        }
        this.startedSaving();
        this.props.saveProjectSb3().then(content => {
            this.finishedSaving();
            downloadBlob(this.props.projectFilename, content);
        });
    }
    async saveAsNew () {
        if (!this.props.canSaveProject) {
            return;
        }
        try {
            const handle = await FileSystemAPI.showSaveFilePicker(this.props.projectFilename);
            await this.saveToHandle(handle);
            this.props.onSetFileHandle(handle);
            const title = getProjectTitleFromFilename(handle.name);
            if (title) {
                this.props.onSetProjectTitle(title);
            }
        } catch (e) {
            this.handleSaveError(e);
        }
    }
    async saveAsFolder() {
        if (!this.props.canSaveProject) {
            return;
        }
        try {
            const handle = await FileSystemAPI.showDirectoryPicker("pm-project-folder", "documents");

            this.startedSaving();
            const jsZip = this.props.saveProjectZip(true);
            this.extractJSZipToHandle(jsZip, handle);
            this.finishedSaving();

            const title = handle.name;
            if (title) {
                this.props.onSetProjectTitle(title);
            }
        } catch (e) {
            this.handleSaveError(e);
        }
    }
    async saveToLastFile () {
        try {
            await this.saveToHandle(this.props.fileHandle);
        } catch (e) {
            this.handleSaveError(e);
        }
    }
    saveToLastFileOrNew () {
        if (this.props.fileHandle) {
            return this.saveToLastFile();
        }
        return this.saveAsNew();
    }
    async saveToHandle (handle) {
        if (!this.props.canSaveProject) {
            return;
        }

        const writable = await handle.createWritable();
        this.startedSaving();

        await new Promise((resolve, reject) => {
            // Projects can be very large, so we'll utilize JSZip's stream API to avoid having the
            // entire sb3 in memory at the same time.
            const jszipStream = this.props.saveProjectSb3Stream();

            const abortController = new AbortController();
            jszipStream.on('error', error => {
                abortController.abort(error);
            });

            // JSZip's stream pause() and resume() methods are not necessarily completely no-ops
            // if they are already paused or resumed. These also make it easier to add debug
            // logging of when we actually pause or resume.
            // Note that JSZip will keep sending some data after you ask it to pause.
            let jszipStreamRunning = false;
            const pauseJSZipStream = () => {
                if (jszipStreamRunning) {
                    jszipStreamRunning = false;
                    jszipStream.pause();
                }
            };
            const resumeJSZipStream = () => {
                if (!jszipStreamRunning) {
                    jszipStreamRunning = true;
                    jszipStream.resume();
                }
            };

            // Allow the JSZip stream to run quite a bit ahead of file writing. This helps
            // reduce zip stream pauses on systems with high latency storage.
            const HIGH_WATER_MARK_BYTES = 1024 * 1024 * 5;

            // Minimum size of buffer to pass into write(). Small buffers will be queued and
            // written in batches as they reach or exceed this size.
            const WRITE_BUFFER_TARGET_SIZE_BYTES = 1024 * 1024;

            const zipStream = new ReadableStream({
                start: controller => {
                    jszipStream.on('data', data => {
                        controller.enqueue(data);
                        if (controller.desiredSize <= 0) {
                            pauseJSZipStream();
                        }
                    });
                    jszipStream.on('end', () => {
                        controller.close();
                    });
                    resumeJSZipStream();
                },
                pull: () => {
                    resumeJSZipStream();
                },
                cancel: () => {
                    pauseJSZipStream();
                }
            }, new ByteLengthQueuingStrategy({
                highWaterMark: HIGH_WATER_MARK_BYTES
            }));

            const queuedChunks = [];
            const fileStream = new WritableStream({
                write: chunk => {
                    queuedChunks.push(chunk);
                    const currentSize = getLengthOfByteArrays(queuedChunks);
                    if (currentSize >= WRITE_BUFFER_TARGET_SIZE_BYTES) {
                        const newBuffer = concatenateByteArrays(queuedChunks);
                        queuedChunks.length = 0;
                        return writable.write(newBuffer);
                    }
                    // Otherwise wait for more data
                },
                close: async () => {
                    // Write the last batch of data.
                    const lastBuffer = concatenateByteArrays(queuedChunks);
                    if (lastBuffer.byteLength) {
                        await writable.write(lastBuffer);
                    }
                    // File handle must be closed at the end to actually save the file.
                    await writable.close();
                },
                abort: async () => {
                    await writable.abort();
                }
            });

            zipStream.pipeTo(fileStream, {
                signal: abortController.signal
            })
                .then(() => {
                    this.finishedSaving();
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    async extractJSZipToHandle (zip, handle) {
        // Not sure how memory management works but im hoping this is fine 
        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            // files will be able to make directories
            if (zipEntry.dir) continue;

            const pathParts = relativePath.split("/");
            const fileName = pathParts.pop();

            // NOTE: Right now there's no reason to preserve directories, but the future save file format will use them.
            // See here for more info: https://docs.penguinmod.com/save-format/
            // make a directory for each file within one
            let currentDir = handle;
            for (const part of pathParts) {
                currentDir = await currentDir.getDirectoryHandle(part, { create: true });
            }

            const fileHandle = await currentDir.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            const content = await zipEntry.async("arraybuffer");
            await writable.write(content);
            await writable.close();
        }
    }
    handleSaveError (e) {
        // AbortError can happen when someone cancels the file selector dialog
        if (e && e.name === 'AbortError') {
            return;
        }
        log.error(e);
        this.props.onShowSaveErrorAlert();
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.downloadProject,
            FileSystemAPI.available() ? {
                available: true,
                name: this.props.fileHandle ? this.props.fileHandle.name : null,
                saveAsNew: this.saveAsNew,
                saveToLastFile: this.saveToLastFile,
                saveToLastFileOrNew: this.saveToLastFileOrNew,
                smartSave: this.saveToLastFileOrNew,
                saveAsFolder: this.saveAsFolder
            } : {
                available: false,
                smartSave: this.downloadProject
            }
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.pmp`;
};

SB3Downloader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    fileHandle: PropTypes.shape({
        name: PropTypes.string
    }),
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func,
    saveProjectSb3Stream: PropTypes.func,
    saveProjectZip: PropTypes.func,
    canSaveProject: PropTypes.bool,
    onSetFileHandle: PropTypes.func,
    onSetProjectTitle: PropTypes.func,
    onShowSavingAlert: PropTypes.func,
    onShowSaveSuccessAlert: PropTypes.func,
    onShowSaveErrorAlert: PropTypes.func,
    onProjectUnchanged: PropTypes.func
};
SB3Downloader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    fileHandle: state.scratchGui.tw.fileHandle,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    saveProjectSb3Stream: state.scratchGui.vm.saveProjectSb3Stream.bind(state.scratchGui.vm),
    // TODO: Is there a good reason to keep saveProjectZip private now that we use JSZip?
    saveProjectZip: state.scratchGui.vm._saveProjectZip.bind(state.scratchGui.vm),
    canSaveProject: getIsShowingProject(state.scratchGui.projectState.loadingState),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

const mapDispatchToProps = dispatch => ({
    onSetFileHandle: fileHandle => dispatch(setFileHandle(fileHandle)),
    onSetProjectTitle: title => dispatch(setProjectTitle(title)),
    onShowSavingAlert: () => showAlertWithTimeout(dispatch, 'saving'),
    onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, 'twSaveToDiskSuccess'),
    onShowSaveErrorAlert: () => dispatch(showStandardAlert('savingError')),
    onProjectUnchanged: () => dispatch(setProjectUnchanged())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3Downloader);
