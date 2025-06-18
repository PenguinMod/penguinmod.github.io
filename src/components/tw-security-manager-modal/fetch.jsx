import React from 'react';
import PropTypes from 'prop-types';
import usbStyles from './load-extension.css';
import {FormattedMessage} from 'react-intl';
import URL from './url.jsx';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';

const FetchModal = props => (
    <div>
        <FormattedMessage
            defaultMessage="The project wants to connect to the website:"
            description="Part of modal shown when a project asks for permission to fetch a URL using an extension"
            id="tw.fetch.title"
        />
        <URL url={props.url} />
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="This could be used to download images or sounds, implement multiplayer, access an API, or for malicious purposes. This will share your IP address, general location, and possibly other data with the website."
                description="Part of modal shown when a project asks for permission to fetch a URL using an extension"
                id="tw.securityManager.why"
            />
        </p>
        <p>
            <FormattedMessage
                defaultMessage="If allowed, further requests to the same website will be automatically allowed."
                description="Part of modal shown when a project asks for permission to fetch a URL using an extension"
                id="tw.securityManager.trust"
            />
        </p>

        <label className={usbStyles.unsandboxedContainer}>
            <FancyCheckbox
                className={usbStyles.unsandboxedCheckbox}
                checked={props.remember}
                onChange={props.onChangeRemember}
            />
            <FormattedMessage
                defaultMessage="Remember my choice for all websites"
                description="Message that allows the user to allow or deny connecting to any website in the future"
                id="pm.fetch.connectFuture"
            />
        </label>
        {props.remember && (
            <div className={usbStyles.unsandboxedWarning}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="Enabling connecting to any future website is dangerous. These websites can share anything, including inappropriate or malicious content. This will share your IP address, general location, and possibly other data with any websites you connect to in the future. You will not be asked to confirm any of the websites that you connect to with this setting enabled."
                    description="Part of modal asking to allow connecting to any website in the future, warning that it is unsafe"
                    id="pm.fetch.connectFutureWarning"
                />
            </div>
        )}
    </div>
);

FetchModal.propTypes = {
    url: PropTypes.string.isRequired,
    remember: PropTypes.bool.isRequired,
    onChangeRemember: PropTypes.func
};

export default FetchModal;
