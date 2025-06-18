import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { APP_NAME } from '../../lib/brand.js';
import styles from './download.css';
import usbStyles from './load-extension.css';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';
import { DEFINITELY_EXECUTABLE, isDefinitelyExecutable } from '../../lib/pm-security-manager-download-util.js';

const FileName = props => {
    const MAX_NAME_LENGTH = 80;
    const MAX_EXTENSION_LENGTH = 30;

    const parts = props.name.split('.');
    let extension = parts.length > 1 ? parts.pop() : null;
    let name = parts.join('.');

    if (name.length > MAX_NAME_LENGTH) {
        name = `${name.substring(0, MAX_NAME_LENGTH)}[...]`;
    }
    if (extension && extension.length > MAX_EXTENSION_LENGTH) {
        extension = `[...]${extension.substring(extension.length - MAX_EXTENSION_LENGTH)}`;
    }

    if (extension === null) {
        return (
            <span className={styles.fileName}>
                {props.name}
            </span>
        );
    }

    return (
        <span className={styles.fileName}>
            <span className={styles.name}>
                {name}
            </span>
            <span className={styles.dot}>
                {'.'}
            </span>
            <span className={styles.extension}>
                {extension}
            </span>
        </span>
    );
};

FileName.propTypes = {
    name: PropTypes.string.isRequired
};

const DownloadModal = props => (
    <div>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="The project wants to download a file to your computer. It will be saved as {name} in your downloads folder."
                description="Part of modal when a project attempts to save a file to someone's downloads folder"
                id="tw.download.file"
                values={{
                    name: (
                        <FileName name={props.name} />
                    )
                }}
            />
        </p>

        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="This file has not been reviewed by the {APP_NAME} developers."
                description="Part of modal when a project attempts to save a file to someone's downloads folder."
                id="tw.download.danger"
                values={{
                    APP_NAME
                }}
            />
        </p>

        {isDefinitelyExecutable(props.name) && (
            <div className={usbStyles.unsandboxedWarning}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="This is an executable file format that may contain malicious code if you run it."
                    description="Part of modal when a project attempts to save a file to someone's downloads folder."
                    id="tw.download.executable"
                    values={{
                        APP_NAME
                    }}
                />
            </div>
        )}

        <label className={usbStyles.unsandboxedContainer}>
            <FancyCheckbox
                className={usbStyles.unsandboxedCheckbox}
                checked={props.remember}
                onChange={props.onChangeRemember}
            />
            <FormattedMessage
                defaultMessage="Remember my choice for all files"
                description="Message that allows the user to allow or deny downloading any file in the future"
                id="pm.download.downloadFuture"
            />
        </label>
        {props.remember && (
            <div className={usbStyles.unsandboxedWarning}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="Downloaded files can contain viruses, malware or other malicious content. It is possible to permanently destroy your computer or personal files if you download a virus or malicious program. You will not be asked to confirm any other download with this setting enabled."
                    description="Part of modal asking to allow downloading any file in the future, warning that it is unsafe"
                    id="pm.download.downloadFutureWarning"
                />
            </div>
        )}
    </div>
);

DownloadModal.propTypes = {
    name: PropTypes.string.isRequired,
    remember: PropTypes.bool.isRequired,
    onChangeRemember: PropTypes.func
};

export default DownloadModal;