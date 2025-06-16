import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import localforage from 'localforage';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import LibraryItemComponent from '../components/library-item/library-item.jsx';

class LibraryItem extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleBlur',
            'handleClick',
            'handleFavoriteClick',
            'handleFocus',
            'handleKeyPress',
            'handleMouseEnter',
            'handleMouseLeave',
            'handlePlay',
            'handleStop',
            'processFavoriteClick',
            'handleDeleteClick',
            'rotateIcon',
            'startRotatingIcons',
            'stopRotatingIcons'
        ]);
        this.state = {
            iconIndex: 0,
            isRotatingIcon: false
        };
    }
    componentWillUnmount () {
        clearInterval(this.intervalId);
    }
    handleBlur (id) {
        this.handleMouseLeave(id);
    }
    handleClick (e) {
        if (e.target.dataset && e.target.dataset.clearclick === 'true') {
            return;
        }
        if (e.target.parentElement.dataset && e.target.parentElement.dataset.clearclick === 'true') {
            return;
        }
        
        if (e.target.closest('a')) {
            // Allow clicking on links inside the item
            return;
        }

        if (!this.props.disabled) {
            if (this.props.href) {
                window.open(this.props.href);
            } else {
                this.props.onSelect(this.props.id, e);
            }
        }
        e.preventDefault();
    }
    handleFavoriteClick (...args) {
        this.processFavoriteClick(...args);
    }
    async handleDeleteClick () {
        const id = this.props._id;
        const db = "pm:favorited_extensions";
        let favorites = [];
        const _saved = await localforage.getItem(db);
        if (_saved) {
            favorites = _saved;
        }

        // remove from favorites
        favorites = favorites.filter(item => {
            // console.log(item._id, id);
            return item._id !== id;
        });

        await localforage.setItem(db, favorites);

        // update on library.jsx
        this.props.onFavoriteUpdated();
    }
    handleFocus (id) {
        if (!this.props.showPlayButton) {
            this.handleMouseEnter(id);
        }
    }
    handleKeyPress (e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.onSelect(this.props.id);
        }
    }
    handleMouseEnter () {
        // only show hover effects on the item if not showing a play button
        if (!this.props.showPlayButton) {
            this.props.onMouseEnter(this.props.id);
            if (this.props.icons && this.props.icons.length) {
                this.stopRotatingIcons();
                this.setState({
                    isRotatingIcon: true
                }, this.startRotatingIcons);
            }
        }
    }
    handleMouseLeave () {
        // only show hover effects on the item if not showing a play button
        if (!this.props.showPlayButton) {
            this.props.onMouseLeave(this.props.id);
            if (this.props.icons && this.props.icons.length) {
                this.setState({
                    isRotatingIcon: false
                }, this.stopRotatingIcons);
            }
        }
    }
    handlePlay () {
        this.props.onMouseEnter(this.props.id);
    }
    handleStop () {
        this.props.onMouseLeave(this.props.id);
    }

    async processFavoriteClick (alreadyFavorite) {
        const id = "pm:favorited_extensions";
        let favorites = [];
        const _saved = await localforage.getItem(id);
        if (_saved) {
            favorites = _saved;
        }

        if (!alreadyFavorite) {
            // add to favorites
            favorites.push(this.props.extensionId);
        } else {
            // remove from favorites
            favorites = favorites.filter(item => {
                return item !== this.props.extensionId;
            });
        }

        await localforage.setItem(id, favorites);

        // update on library.jsx
        this.props.onFavoriteUpdated();
    }

    startRotatingIcons () {
        this.rotateIcon();
        this.intervalId = setInterval(this.rotateIcon, 300);
    }
    stopRotatingIcons () {
        if (this.intervalId) {
            this.intervalId = clearInterval(this.intervalId);
        }
    }
    rotateIcon () {
        const nextIconIndex = (this.state.iconIndex + 1) % this.props.icons.length;
        this.setState({iconIndex: nextIconIndex});
    }
    curIconMd5 () {
        const iconMd5Prop = this.props.iconMd5;
        if (this.props.icons &&
            this.state.isRotatingIcon &&
            this.state.iconIndex < this.props.icons.length) {
            const icon = this.props.icons[this.state.iconIndex] || {};
            return icon.md5ext || // 3.0 library format
                icon.baseLayerMD5 || // 2.0 library format, TODO GH-5084
                iconMd5Prop;
        }
        return iconMd5Prop;
    }
    render () {
        const iconMd5 = this.curIconMd5();
        const iconURL = iconMd5 ?
            `https://cdn.assets.scratch.mit.edu/internalapi/asset/${iconMd5}/get/` :
            this.props.iconRawURL;
        return (
            <LibraryItemComponent
                intl={this.props.intl}
                bluetoothRequired={this.props.bluetoothRequired}
                collaborator={this.props.collaborator}
                twDeveloper={this.props.twDeveloper}
                credits={this.props.credits}
                extDeveloper={this.props.extDeveloper}
                eventSubmittor={this.props.eventSubmittor}
                extraLabels={this.props.extraLabels}
                description={this.props.description}
                disabled={this.props.disabled}
                isNew={this.props.isNew}
                extensionId={this.props.extensionId}
                featured={this.props.featured}
                hidden={this.props.hidden}
                iconURL={iconURL}
                overlayURL={this.props.overlayURL}
                styleForSound={this.props.styleForSound}
                soundType={this.props.soundType}
                soundLength={this.props.soundLength}
                icons={this.props.icons}
                id={this.props.id}
                _id={this.props._id}
                incompatibleWithScratch={this.props.incompatibleWithScratch}
                extensionWarningOnImport={this.props.extensionWarningOnImport}
                insetIconURL={this.props.insetIconURL}
                customInsetColor={this.props.customInsetColor}
                internetConnectionRequired={this.props.internetConnectionRequired}
                isPlaying={this.props.isPlaying}
                name={this.props.name}
                showPlayButton={this.props.showPlayButton}

                favoritable={this.props.favoritable}
                favorited={this.props.favorited}
                deletable={this.props.deletable}
                custom={this.props.custom}
                _unsandboxed={this.props._unsandboxed}
                onFavoriteClick={this.handleFavoriteClick}
                onDeleteClick={this.handleDeleteClick}

                onBlur={this.handleBlur}
                onClick={this.handleClick}
                onFocus={this.handleFocus}
                onKeyPress={this.handleKeyPress}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onPlay={this.handlePlay}
                onStop={this.handleStop}
            />
        );
    }
}

LibraryItem.propTypes = {
    intl: intlShape,
    bluetoothRequired: PropTypes.bool,
    collaborator: PropTypes.oneOfType([
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
    credits: PropTypes.oneOfType([
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
    href: PropTypes.string,
    featured: PropTypes.bool,
    isNew: PropTypes.bool,
    hidden: PropTypes.bool,
    iconMd5: PropTypes.string,
    iconRawURL: PropTypes.string,
    overlayURL: PropTypes.string,
    styleForSound: PropTypes.bool,
    soundType: PropTypes.string,
    soundLength: PropTypes.number,
    icons: PropTypes.arrayOf(
        PropTypes.shape({
            baseLayerMD5: PropTypes.string, // 2.0 library format, TODO GH-5084
            md5ext: PropTypes.string // 3.0 library format
        })
    ),
    id: PropTypes.number.isRequired,
    incompatibleWithScratch: PropTypes.bool,
    extensionWarningOnImport: PropTypes.bool,
    insetIconURL: PropTypes.string,
    internetConnectionRequired: PropTypes.bool,
    isPlaying: PropTypes.bool,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    showPlayButton: PropTypes.bool,
    favoritable: PropTypes.bool,
    favorited: PropTypes.bool,
    deletable: PropTypes.bool,
    custom: PropTypes.bool,
    onFavoriteUpdated: PropTypes.func,
    _unsandboxed: PropTypes.bool,
    _id: PropTypes.string,
};

export default injectIntl(LibraryItem);
