import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import communityIcon from './icon--see-community.svg';
import styles from './community-button.css';

const CommunityButton = ({
    className,
    onClick
}) => (
    <Button
        className={classNames(
            className,
            styles.communityButton
        )}
        onClick={onClick}
    >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img
                src={communityIcon}
                className={styles.communityButtonIcon}
                alt="See Project Page"
                style={{ filter: (typeof window !== 'undefined' && window.isHighContrast) ? 'invert(1)' : 'none' }}
            />
            <FormattedMessage
                defaultMessage="See Project Page"
                description="Label for see project page button"
                id="gui.menuBar.seeProjectPage"
            />
        </span>
    </Button>
);

CommunityButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
};

CommunityButton.defaultProps = {
    onClick: () => {}
};

export default CommunityButton;
