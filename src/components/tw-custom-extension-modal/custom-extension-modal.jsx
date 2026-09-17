import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import FileInput from './file-input.jsx';
import styles from './custom-extension-modal.css';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';
import {APP_NAME} from '../../lib/brand';

const messages = defineMessages({
    title: {
        defaultMessage: 'Load Custom Extension',
        description: 'Title of custom extension menu',
        id: 'tw.customExtensionModal.title'
    }
});

const CustomExtensionModal = props => (
    <Modal
        scrollable={true}
        className={styles.modalContent}
        onRequestClose={props.onClose}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="customExtensionModal"
    >
        <Box
            className={styles.body}
            onDragOver={props.onDragOver}
            onDragLeave={props.onDragLeave}
            onDrop={props.onDrop}
        >
            <div className={styles.typeSelectorContainer}>
                <div
                    className={styles.typeSelectorButton}
                    data-active={props.type === 'url'}
                    onClick={props.onSwitchToURL}
                    tabIndex={0}
                >
                    <FormattedMessage
                        defaultMessage="URL"
                        // eslint-disable-next-line max-len
                        description="Button to choose to load an extension from a remote URL. Not much space, so keep this short."
                        id="tw.customExtensionModal.url"
                    />
                </div>
                <div
                    className={styles.typeSelectorButton}
                    data-active={props.type === 'file'}
                    onClick={props.onSwitchToFile}
                    tabIndex={0}
                >
                    <FormattedMessage
                        defaultMessage="File"
                        // eslint-disable-next-line max-len
                        description="Button to choose to load an extension from a local file. Not much space, so keep this short."
                        id="tw.customExtensionModal.file"
                    />
                </div>
                <div
                    className={styles.typeSelectorButton}
                    data-active={props.type === 'text'}
                    onClick={props.onSwitchToText}
                    tabIndex={0}
                >
                    <FormattedMessage
                        defaultMessage="Text"
                        // eslint-disable-next-line max-len
                        description="Button to choose to load an extension from a text input. Not much space, so keep this short."
                        id="tw.customExtensionModal.text"
                    />
                </div>
            </div>

            {props.type === 'url' ? (
                <React.Fragment key={props.type}>
                    <p>
                        <FormattedMessage
                            defaultMessage="Enter the extension's URL:"
                            description="Label that appears when loading a custom extension from a URL"
                            id="tw.customExtensionModal.promptURL"
                        />
                    </p>
                    <input
                        type="text"
                        className={styles.urlInput}
                        value={props.url}
                        onChange={props.onChangeURL}
                        onKeyDown={props.onKeyDown}
                        placeholder="https://extensions.turbowarp.org/..."
                        autoFocus
                    />
                </React.Fragment>
            ) : props.type === 'file' ? (
                <React.Fragment key={props.type}>
                    <p>
                        <FormattedMessage
                            defaultMessage="Select the extension's JavaScript file:"
                            description="Label that appears when loading a custom extension from a file"
                            id="tw.customExtensionModal.promptFile"
                        />
                    </p>
                    <FileInput
                        accept=".js"
                        onChange={props.onChangeFile}
                        file={props.file}
                    />
                </React.Fragment>
            ) : (
                <React.Fragment key={props.type}>
                    <p>
                        <FormattedMessage
                            defaultMessage="Paste the extension's JavaScript source code:"
                            description="Label that appears when loading a custom extension from a text input"
                            id="tw.customExtensionModal.promptText"
                        />
                    </p>
                    <textarea
                        className={styles.textCodeInput}
                        placeholder={'class Extension {\n  // ...\n}\nScratch.extensions.register(new Extension());'}
                        value={props.text}
                        onChange={props.onChangeText}
                        autoFocus
                        spellCheck={false}
                    />
                </React.Fragment>
            )}

            {props.onChangeUnsandboxed ? (
                <React.Fragment>
                    <label className={styles.unsandboxedContainer}>
                        <FancyCheckbox
                            className={styles.unsandboxedCheckbox}
                            checked={props.unsandboxed}
                            onChange={props.onChangeUnsandboxed}
                        />
                        <FormattedMessage
                            defaultMessage="Run extension without sandbox"
                            description="Message that appears in custom extension prompt"
                            id="tw.customExtensionModal.unsandboxed"
                        />
                    </label>
                    {props.unsandboxed && (
                        <p className={styles.unsandboxedWarning}>
                            <FormattedMessage
                                // eslint-disable-next-line max-len
                                defaultMessage="Loading extensions without the sandbox is dangerous and should not be enabled if you don't know what you're doing."
                                description="Warning that appears when disabling extension security sandbox"
                                id="tw.customExtensionModal.unsandboxedWarning1"
                            />
                            <FormattedMessage
                                // eslint-disable-next-line max-len
                                defaultMessage="Unsandboxed extensions can corrupt your project, delete your settings, phish for passwords, and other bad things. The {APP_NAME} developers are not responsible for any resulting issues."
                                description="Warning that appears when disabling extension security sandbox"
                                id="pm.customExtensionModal.unsandboxedWarning2"
                                values={{
                                    APP_NAME
                                }}
                            />
                        </p>
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {props.unsandboxed ? (
                        <p className={styles.trustedExtension}>
                            <FormattedMessage
                                // eslint-disable-next-line max-len
                                defaultMessage="This extension will be loaded without the sandbox because it is from a trusted source."
                                description="Message that appears in custom extension prompt"
                                id="tw.customExtensionModal.trusted"
                            />
                        </p>
                    ) : (
                        <p>
                            <FormattedMessage
                                // eslint-disable-next-line max-len
                                defaultMessage="Extensions from untrusted URLs will always be loaded with the sandbox for security."
                                description="Message that appears in custom extension prompt"
                                id="tw.customExtensionModal.untrusted"
                            />
                        </p>
                    )}
                </React.Fragment>
            )}

            {props.type === 'url' && (
                <p>
                    <FormattedMessage
                        // eslint-disable-next-line max-len
                        defaultMessage="Your browser may not allow Permafy to access certain sites. If this is causing issues for you, try loading from a file or text instead."
                        description="Message that appears in custom extension prompt"
                        id="pm.customExtensionModal.corsProblem"
                    />
                </p>
            )}

            <label className={styles.checkboxContainer}>
                <FancyCheckbox
                    className={styles.basicCheckbox}
                    checked={props.addToLibrary}
                    onChange={props.onChangeAddToLibrary}
                />
                <FormattedMessage
                    defaultMessage="Add extension to extensions list"
                    description="Toggle to add a custom extension to the extension library."
                    id="pm.customExtensionModal.addToLibrary"
                />
            </label>
            {props.addToLibrary && (
                <div>
                    <p>
                        <FormattedMessage
                            defaultMessage="Name the extension"
                            description="Box to name the custom extension being added to the extension library"
                            id="pm.customExtensionModal.libraryName"
                        />
                    </p>
                    <input
                        type="text"
                        className={styles.urlInput}
                        value={props.libraryItemName}
                        onChange={(...args) => props.onChangeLibraryItem("name", ...args)}
                        placeholder="My cool extension"
                        autoFocus
                    />
                    <p>
                        <FormattedMessage
                            defaultMessage="Describe the extension"
                            description="Box to create the description for the custom extension being added to the extension library"
                            id="pm.customExtensionModal.libraryDescription"
                        />
                    </p>
                    <input
                        type="text"
                        className={styles.urlInput}
                        value={props.libraryItemDescription}
                        onChange={(...args) => props.onChangeLibraryItem("description", ...args)}
                        placeholder="Makes your project cooler!"
                    />
                    <p>
                        <FormattedMessage
                            defaultMessage="Upload an Extension Banner"
                            description="Space to upload an extension banner for the custom extension being added to the extension library"
                            id="pm.customExtensionModal.libraryImage"
                        />
                    </p>
                    <FileInput
                        accept=".png,.jpg,.jpeg,.gif,.svg"
                        onChange={(...args) => props.onChangeLibraryItem("rawURL", ...args)}
                        file={props.libraryItemFile}
                    />
                    {props.libraryItemFile && (
                        <img
                            alt="Extension Image"
                            src={props.libraryItemImage}
                            className={styles.libraryItemImage}
                        />
                    )}
                    <p>
                        <i>
                            <FormattedMessage
                                defaultMessage="This extension will only appear on your menu."
                                description="Label explaining the custom library extension only appears for themselves."
                                id="pm.customExtensionModal.libraryOnlyYours1"
                            />
                            <br />
                            <FormattedMessage
                                defaultMessage="Other people will not see this extension when they open the menu."
                                description="Label explaining the custom library extension only appears for themselves."
                                id="pm.customExtensionModal.libraryOnlyYours2"
                            />
                        </i>
                    </p>
                </div>
            )}

            <div className={styles.buttonRow}>
                <button
                    className={styles.loadButton}
                    onClick={props.onLoadExtension}
                    disabled={!props.canLoadExtension}
                >
                    <FormattedMessage
                        defaultMessage="Load"
                        description="Button that loads the given custom extension"
                        id="tw.customExtensionModal.load"
                    />
                </button>
            </div>
        </Box>
    </Modal>
);

CustomExtensionModal.propTypes = {
    intl: intlShape,
    canLoadExtension: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['url', 'file', 'text']).isRequired,
    onSwitchToFile: PropTypes.func.isRequired,
    onSwitchToURL: PropTypes.func.isRequired,
    onSwitchToText: PropTypes.func.isRequired,
    file: PropTypes.instanceOf(File),
    onChangeFile: PropTypes.func.isRequired,
    onDragOver: PropTypes.func.isRequired,
    onDragLeave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    onChangeURL: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    unsandboxed: PropTypes.bool.isRequired,
    addToLibrary: PropTypes.bool.isRequired,
    onChangeUnsandboxed: PropTypes.func,
    onChangeAddToLibrary: PropTypes.func,
    onChangeLibraryItem: PropTypes.func,
    onLoadExtension: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default injectIntl(CustomExtensionModal);
