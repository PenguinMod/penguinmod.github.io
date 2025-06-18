import React from 'react';
import PropTypes from 'prop-types';
import usbStyles from './load-extension.css';
import {FormattedMessage} from 'react-intl';
import URL from './url.jsx';
import DataURL from './data-url.jsx';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';

const EmbedModal = props => (
    <div>
        {props.url.startsWith('data:') ? (
            <React.Fragment>
                <p>
                    <FormattedMessage
                        defaultMessage="The project wants to embed HTML content over the stage:"
                        description="Part of modal when a project attempts to embed another page over the stage"
                        id="tw.embed.title1"
                    />
                </p>
                <DataURL url={props.url} />
            </React.Fragment>
        ) : (
            <React.Fragment>
                <p>
                    <FormattedMessage
                        defaultMessage="The project wants to embed remote content over the stage:"
                        description="Part of modal when a project attempts to embed another page over the stage"
                        id="tw.embed.title2"
                    />
                </p>
                <URL url={props.url} />
            </React.Fragment>
        )}
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="While the embed will be sandboxed, it will still have access to information about your device such as your IP and general location."
                description="Part of modal when a project attempts to embed another page over the stage"
                id="tw.embed.risks"
            />
        </p>
        {!props.url.startsWith('data:') && (
            <p>
                <FormattedMessage
                    defaultMessage="If allowed, further embeds to the same site will be automatically allowed."
                    description="Part of modal when a project attempts to embed another page over the stage"
                    id="tw.embed.persistent"
                />
            </p>
        )}

        <label className={usbStyles.unsandboxedContainer}>
            <FancyCheckbox
                className={usbStyles.unsandboxedCheckbox}
                checked={props.remember}
                onChange={props.onChangeRemember}
            />
            <FormattedMessage
                defaultMessage="Remember my choice for all websites"
                description="Message that allows the user to allow or deny embedding any website in the future"
                id="pm.embed.connectFuture"
            />
        </label>
        {props.remember && (
            <div className={usbStyles.unsandboxedWarning}>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="Enabling embedding any future website is dangerous. These websites can share anything, including inappropriate or malicious content. This will share your IP address, general location, and possibly other data with any websites you connect to in the future. You will not be asked to confirm any of the websites that you embed with this setting enabled."
                    description="Part of modal asking to allow connecting to any website in the future, warning that it is unsafe"
                    id="pm.embed.connectFutureWarning"
                />
            </div>
        )}
    </div>
);

EmbedModal.propTypes = {
    url: PropTypes.string.isRequired,
    remember: PropTypes.bool.isRequired,
    onChangeRemember: PropTypes.func
};

export default EmbedModal;
