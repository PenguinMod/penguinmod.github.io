import {FormattedMessage, intlShape, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import PlayButton from '../../containers/play-button.jsx';
import styles from './library-item.css';
import classNames from 'classnames';

import bluetoothIconURL from './bluetooth.svg';
import internetConnectionIconURL from './internet-connection.svg';

import favoritedFilledUrl from './favorite/filled.svg';
import favoritedOutlineUrl from './favorite/outline.svg';
import deleteFilledUrl from './delete/filled.svg';
import downloadFilled from './download/filled.svg';

const getURLOrigin = (url) => {
    let urlObj;
    try {
        urlObj = new URL(url);
    } catch {
        // not a valid URL
        return String(url);
    }
    return urlObj.origin;
};
const getMSFormatted = (ms) => {
    return (ms / 1000).toFixed(2);
};

/* eslint-disable react/prefer-stateless-function */
class LibraryItemComponent extends React.PureComponent {
    render() {
        return this.props.featured ? (
            <div
                className={classNames(
                    styles.libraryItem,
                    styles.featuredItem,
                    {
                        [styles.disabled]: this.props.disabled
                    },
                    typeof this.props.extensionId === 'string' ? styles.libraryItemExtension : null,
                    this.props.hidden ? styles.hidden : null
                )}
                onClick={this.props.onClick}
            >
                <div className={styles.featuredImageContainer}>
                    {this.props.disabled ? (
                        <div className={styles.comingSoonText}>
                            <FormattedMessage
                                defaultMessage="Coming Soon"
                                description="Label for extensions that are not yet implemented"
                                id="gui.extensionLibrary.comingSoon"
                            />
                        </div>
                    ) : null}
                    <img
                        className={styles.featuredImage}
                        loading="lazy"
                        draggable={false}
                        src={this.props.iconURL}
                    />
                </div>
                {(this.props.insetIconURL && !this.props.customInsetColor) ? (
                    <div className={
                        this.props.twDeveloper ?
                            classNames(styles.libraryItemInsetImageContainer, styles.twLibraryItemInsetImageContainer)
                            : styles.libraryItemInsetImageContainer
                    }
                    >
                        <img
                            className={styles.libraryItemInsetImage}
                            src={this.props.insetIconURL}
                            draggable={false}
                        />
                    </div>
                ) : null}
                {(this.props.insetIconURL && this.props.customInsetColor) ? (
                    <div className={
                        styles.libraryItemInsetImageContainerNoBg
                    }
                        style={{ backgroundColor: this.props.customInsetColor }}
                    >
                        <img
                            className={styles.libraryItemInsetImage}
                            src={this.props.insetIconURL}
                        />
                    </div>
                ) : null}
                {(this.props.favoritable && !this.props.deletable) ? (
                    <button
                        // data-clearclick just makes it so the item
                        // doesnt get selected when clicking this element
                        data-clearclick="true"
                        data-activated={this.props.favorited === true}
                        className={styles.libraryItemFavorite}
                        onClick={() => this.props.onFavoriteClick(this.props.favorited)}
                    >
                        {this.props.favorited === true ? (
                            <img
                                data-usedimage="true"
                                data-clearclick="true"
                                src={favoritedFilledUrl}
                            />
                        ) : (
                            <img
                                data-usedimage="true"
                                data-clearclick="true"
                                src={favoritedOutlineUrl}
                            />
                        )}
                        <img
                            data-usedimage="false"
                            data-clearclick="true"
                            src={favoritedFilledUrl}
                        />
                    </button>
                ) : null}
                {this.props.deletable && (
                    <button
                        // data-clearclick just makes it so the item
                        // doesnt get selected when clicking this element
                        data-clearclick="true"
                        className={styles.libraryItemDelete}
                        onClick={this.props.onDeleteClick}
                    >
                        <img
                            data-clearclick="true"
                            src={deleteFilledUrl}
                        />
                    </button>
                )}
                <div
                    className={typeof this.props.extensionId === 'string' ?
                        classNames(styles.featuredExtensionText, styles.featuredText) : styles.featuredText
                    }
                >
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                    <br />
                    <span className={styles.featuredDescription}>{this.props.description}</span>
                    {this.props.custom && (
                        <>
                            <br />
                            {this.props.extensionId.startsWith("data:") ? (
                                <span>
                                    {this.props._unsandboxed ?
                                        (
                                            <FormattedMessage
                                                defaultMessage="Custom Unsandboxed extension"
                                                description="Label for custom library extensions that are unsandboxed (not safe)"
                                                id="pm.extensionLibrary.customLibraryExtensionUnsandboxed"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="Custom Sandboxed extension"
                                                description="Label for custom library extensions that are sandboxed"
                                                id="pm.extensionLibrary.customLibraryExtensionSandboxed"
                                            />
                                        )}
                                </span>
                            ) : (
                                <span>
                                    <FormattedMessage
                                        defaultMessage="Added from a website"
                                        description="Label for custom library extensions that are added from a URL"
                                        id="pm.extensionLibrary.customLibraryExtensionWebsite"
                                    />
                                </span>
                            )}
                            {this.props.extensionId.startsWith("data:") ? (
                                <span className={styles.featuredDescription}>
                                    <FormattedMessage
                                        defaultMessage="Loaded from Text / File"
                                        description="Label for custom library extensions that are added from text or a file"
                                        id="pm.extensionLibrary.customLibraryExtensionTextOrFile"
                                    />
                                    <a
                                        data-clearclick="true"
                                        download="extension.js"
                                        href={this.props.extensionId}
                                    >
                                        <button
                                            data-clearclick="true"
                                            className={styles.inspectExtension}
                                        >
                                            <img
                                                data-clearclick="true"
                                                src={downloadFilled}
                                                alt="Download"
                                            />
                                        </button>
                                    </a>
                                </span>
                            ) : (
                                <a
                                    target='_blank'
                                    data-clearclick="true"
                                    href={this.props.extensionId}
                                    className={styles.featuredDescription}
                                >
                                    {getURLOrigin(this.props.extensionId)}
                                </a>
                            )}
                        </>
                    )}
                </div>
                {
                    this.props.bluetoothRequired ||
                        this.props.internetConnectionRequired ||
                        this.props.collaborator ||
                        this.props.extDeveloper ||
                        this.props.twDeveloper ||
                        this.props.eventSubmittor ||
                        this.props.credits
                        ? (
                            <div className={styles.featuredExtensionMetadata}>
                                <div className={styles.featuredExtensionRequirement}>
                                    {this.props.bluetoothRequired || this.props.internetConnectionRequired ? (
                                        <div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Requires"
                                                    description="Label for extension hardware requirements"
                                                    id="gui.extensionLibrary.requires"
                                                />
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.bluetoothRequired ? (
                                                    <img src={bluetoothIconURL} />
                                                ) : null}
                                                {this.props.internetConnectionRequired ? (
                                                    <img src={internetConnectionIconURL} />
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className={styles.featuredExtensionCollaboration}>
                                    {this.props.collaborator ? (
                                        <div className={styles.smallBottomMargin}>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Collaboration with"
                                                    description="Label for extension collaboration"
                                                    id="gui.extensionLibrary.collaboration"
                                                />
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.collaborator}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.twDeveloper ? (
                                        <div className={styles.smallBottomMargin}>
                                            <div>
                                                Originally for TurboWarp by
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.twDeveloper}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.extDeveloper ? (
                                        <div className={styles.smallBottomMargin}>
                                            <div>
                                                Created by
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.extDeveloper}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.eventSubmittor ? (
                                        <div className={styles.smallBottomMargin}>
                                            <div>
                                                Event Submission by
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.eventSubmittor}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.credits ? (
                                        <div className={styles.smallBottomMargin}>
                                            <div>
                                                Credits
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {this.props.credits}
                                            </div>
                                        </div>
                                    ) : null}
                                    {this.props.extraLabels ? this.props.extraLabels.map((label) => (
                                        <div className={styles.smallBottomMargin}>
                                            <div>
                                                {label.name}
                                            </div>
                                            <div
                                                className={styles.featuredExtensionMetadataDetail}
                                            >
                                                {label.value}
                                            </div>
                                        </div>
                                    )) : null}
                                </div>
                            </div>
                        ) : null}
            </div>
        ) : (
            <Box
                className={classNames(
                    styles.libraryItem, {
                    [styles.hidden]: this.props.hidden,
                    [styles.libraryItemSound]: this.props.styleForSound,
                    [styles.libraryItemNew]: this.props.isNew,
                }
                )}
                role="button"
                tabIndex="0"
                onBlur={this.props.onBlur}
                onClick={this.props.onClick}
                onFocus={this.props.onFocus}
                onKeyPress={this.props.onKeyPress}
                onMouseEnter={this.props.showPlayButton ? null : this.props.onMouseEnter}
                onMouseLeave={this.props.showPlayButton ? null : this.props.onMouseLeave}
            >
                {this.props.isNew && (
                    <div className={styles.libraryItemNewBadge}>
                        NEW
                    </div>
                )}
                {/* Layers of wrapping is to prevent layout thrashing on animation */}
                <Box className={styles.libraryItemImageContainerWrapper}>
                    <Box
                        className={styles.libraryItemImageContainer}
                        onMouseEnter={this.props.showPlayButton ? this.props.onMouseEnter : null}
                        onMouseLeave={this.props.showPlayButton ? this.props.onMouseLeave : null}
                    >
                        <img
                            className={classNames(
                                styles.libraryItemImage, {
                                [styles.libraryItemWaveform]: this.props.styleForSound
                            }
                            )}
                            loading="lazy"
                            src={this.props.iconURL}
                            draggable={false}
                        />
                        {this.props.overlayURL && (
                            <img
                                className={classNames(
                                    styles.libraryItemImage, styles.libraryItemImageOverlay, {
                                    [styles.libraryItemWaveform]: this.props.styleForSound
                                }
                                )}
                                loading="lazy"
                                src={this.props.overlayURL}
                                draggable={false}
                            />
                        )}
                    </Box>
                </Box>
                {this.props.styleForSound ? (
                    <div className={styles.libraryItemSoundInfoContainer}>
                        <span className={classNames(styles.libraryItemName, styles.libraryItemSoundName)}>{this.props.name}</span>
                        <span className={classNames(styles.libraryItemName, styles.libraryItemSoundType)}>
                            {this.props.soundType}, {getMSFormatted(this.props.soundLength)}
                        </span>
                    </div>
                ) : (
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                )}
                {this.props.showPlayButton ? (
                    <PlayButton
                        className={classNames({
                            [styles.libraryItemSoundPlayButton]: this.props.styleForSound,
                            [styles.libraryItemNewPlayButton]: this.props.isNew,
                        })}
                        isPlaying={this.props.isPlaying}
                        onPlay={this.props.onPlay}
                        onStop={this.props.onStop}
                    />
                ) : null}
            </Box>
        );
    }
}
/* eslint-enable react/prefer-stateless-function */


LibraryItemComponent.propTypes = {
    intl: intlShape,
    bluetoothRequired: PropTypes.bool,
    collaborator: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    credits: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    twDeveloper: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    extDeveloper: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    eventSubmittor: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    extraLabels: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
        })
    ),
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    isNew: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    overlayURL: PropTypes.string,
    insetIconURL: PropTypes.string,
    styleForSound: PropTypes.bool,
    soundType: PropTypes.string,
    soundLength: PropTypes.number,
    customInsetColor: PropTypes.string,
    internetConnectionRequired: PropTypes.bool,
    isPlaying: PropTypes.bool,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    onBlur: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    showPlayButton: PropTypes.bool,

    favoritable: PropTypes.bool,
    favorited: PropTypes.bool,
    deletable: PropTypes.bool,
    custom: PropTypes.bool,
    onFavoriteClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    _id: PropTypes.string,
    _unsandboxed: PropTypes.bool
};

LibraryItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

export default LibraryItemComponent;
