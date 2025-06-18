import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import SecurityModals from '../../lib/tw-security-manager-constants';
import LoadExtensionModal from './load-extension.jsx';
import FetchModal from './fetch.jsx';
import OpenWindowModal from './open-window.jsx';
import RedirectModal from './redirect.jsx';
import RecordAudio from './record-audio.jsx';
import RecordVideo from './record-video.jsx';
import ReadClipboard from './read-clipboard.jsx';
import Notify from './notify.jsx';
import Geolocate from './geolocate.jsx';
import Unsandbox from './unsandbox.jsx';
import Embed from './embed.jsx';
import Download from './download.jsx';
import DelayedMountPropertyHOC from './delayed-mount-property-hoc.jsx';
import styles from './security-manager-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Extension Security',
        // eslint-disable-next-line max-len
        description: 'Title of modal thats asks the user for permission to let the project load an extension, fetch a resource, open a window, etc.',
        id: 'tw.securityManager.title'
    }
});

const noop = () => {};

const SecurityManagerModalComponent = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.enableButtons ? props.onDenied : noop}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="securitymanagermodal"
    >
        <Box className={styles.body}>
            {props.type === SecurityModals.LoadExtension ? (
                <LoadExtensionModal {...props.data} />
            ) : props.type === SecurityModals.Fetch ? (
                <FetchModal {...props.data} />
            ) : props.type === SecurityModals.OpenWindow ? (
                <OpenWindowModal {...props.data} />
            ) : props.type === SecurityModals.Redirect ? (
                <RedirectModal {...props.data} />
            ) : props.type === SecurityModals.RecordAudio ? (
                <RecordAudio {...props.data} />
            ) : props.type === SecurityModals.RecordVideo ? (
                <RecordVideo {...props.data} />
            ) : props.type === SecurityModals.ReadClipboard ? (
                <ReadClipboard {...props.data} />
            ) : props.type === SecurityModals.Notify ? (
                <Notify {...props.data} />
            ) : props.type === SecurityModals.Geolocate ? (
                <Geolocate {...props.data} />
            ) : props.type === SecurityModals.Unsandbox ? (
                <Unsandbox {...props.data} />
            ) : props.type === SecurityModals.Embed ? (
                <Embed {...props.data} />
            ) : props.type === SecurityModals.ScreenshotCamera ? (
                <RecordVideo {...props.data} />
            ) : props.type === SecurityModals.Download ? (
                <Download {...props.data} />
            ) : null}

            <Box className={styles.buttons}>
                <button
                    className={styles.denyButton}
                    onClick={props.onDenied}
                    disabled={!props.enableButtons}
                >
                    <FormattedMessage
                        defaultMessage="Deny"
                        description="Button in modal asking user for permission to load extension, access file, etc."
                        id="tw.securityManager.deny"
                    />
                </button>
                <button
                    className={styles.allowButton}
                    onClick={props.onAllowed}
                    disabled={!props.enableButtons}
                >
                    <FormattedMessage
                        defaultMessage="Allow"
                        description="Button in modal asking user for permission to load extension, access file, etc."
                        id="tw.securityManager.allow"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

SecurityManagerModalComponent.propTypes = {
    intl: intlShape,
    type: PropTypes.oneOf(Object.values(SecurityModals)),
    enableButtons: PropTypes.bool,
    // Each modal may have different type of data
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
    onAllowed: PropTypes.func.isRequired,
    onDenied: PropTypes.func.isRequired
};

// Prevent accidentally pressing buttons immediately when a prompt appears.
const BUTTON_DELAY = 750;
export default DelayedMountPropertyHOC(injectIntl(SecurityManagerModalComponent), BUTTON_DELAY, {
    enableButtons: true
});
