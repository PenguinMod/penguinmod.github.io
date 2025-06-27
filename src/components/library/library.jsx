import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import localforage from 'localforage';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import LibraryItem from '../../containers/library-item.jsx';
import Modal from '../../containers/modal.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';
import TagButton from '../../containers/tag-button.jsx';
import TagCheckbox from '../../containers/tag-checkbox.jsx';
import Spinner from '../spinner/spinner.jsx';
import Separator from '../tw-extension-separator/separator.jsx';

import styles from './library.css';

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    allTag: {
        id: 'gui.library.allTag',
        defaultMessage: 'All',
        description: 'Label for library tag to revert to all items after filtering by tag.'
    }
});

const PM_LIBRARY_API = "https://library.penguinmod.com/";

const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};
const tagListPrefix = [];

/**
 * Returns true if the array includes items from the other array.
 * @param {Array} array The array to check
 * @param {Array} from The array with the items that need to be included
 * @returns {boolean}
 */
const arrayIncludesItemsFrom = (array, from) => {
    if (!Array.isArray(array)) array = [];
    if (!Array.isArray(from)) from = [];
    const value = from.every((value) => {
        return array.indexOf(value) >= 0;
    });
    // console.log(array, from, value);
    return value;
};

class LibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleFilterChange',
            'handleFilterClear',
            'handleMouseEnter',
            'handleMouseLeave',
            'handlePlayingEnd',
            'handleSelect',
            'handleTagClick',
            'setFilteredDataRef',
            'loadLibraryData',
            'loadLibraryFavorites',
            'waitForLoading',
            'handleFavoritesUpdate',
            'createFilteredData',
            'getFilteredData'
        ]);
        this.state = {
            playingItem: null,
            filterQuery: '',
            selectedTags: [],
            favorites: [],
            collapsed: false,
            loaded: false,
            data: props.data
        };

        // used for actor libraries
        // they have special things like favorited items
        // the way they load though breaks stuff
        this.usesSpecialLoading = [
            "ExtensionLibrary"
        ];
    }

    loadLibraryData () {
        return new Promise((resolve) => {
            if (this.state.data.then) {
                // If data is a promise, wait for the promise to resolve
                this.state.data.then(data => {
                    resolve({ key: "data", value: data });
                });
            } else {
                // Allow the spinner to display before loading the content
                setTimeout(() => {
                    const data = this.state.data;
                    resolve({ key: "data", value: data });
                });
            }
        });
    }
    async loadLibraryFavorites () {
        const favorites = await localforage.getItem("pm:favorited_extensions");
        return { key: "favorites", value: favorites ? favorites : [] };
    }
    async handleFavoritesUpdate () {
        const favorites = await localforage.getItem("pm:favorited_extensions");
        this.setState({
            favorites
        });
    }

    async waitForLoading (processes) {
        // we store values in here
        const packet = {};
        for (const process of processes) {
            // result = { key: "data", value: ... }
            const result = await process();
            packet[result.key] = result.value;
        }
        return packet;
    }

    componentDidMount() {
        if (!this.usesSpecialLoading.includes(this.props.actor)) {
            // regular loading
            if (this.state.data.then) {
                // If data is a promise, wait for the promise to resolve
                this.state.data.then(data => {
                    this.setState({
                        loaded: true,
                        data
                    });
                });
            } else {
                // Allow the spinner to display before loading the content
                setTimeout(() => {
                    this.setState({ loaded: true });
                });
            }
        }
        if (this.props.setStopHandler) this.props.setStopHandler(this.handlePlayingEnd);
        if (!this.usesSpecialLoading.includes(this.props.actor)) return;
        // special loading
        const spinnerProcesses = [this.loadLibraryData];
        // pm: actors can load extra stuff
        // pm: if we are acting as the extension library, load favorited extensions
        if (this.props.actor === "ExtensionLibrary") {
            spinnerProcesses.push(this.loadLibraryFavorites);
        }
        // wait for spinner stuff
        this.waitForLoading(spinnerProcesses).then((packet) => {
            const data = { loaded: true, ...packet };
            this.setState(data);
        });
    }
    // uncomment this if favorites start exploding the website lol!
    // componentWillUnmount () {
    //     // pm: clear favorites from.... memory idk
    //     this.setState({
    //         favorites: []
    //     });
    // }
    componentDidUpdate (prevProps, prevState) {
        if (prevState.filterQuery !== this.state.filterQuery ||
            prevState.selectedTags.length !== this.state.selectedTags.length) {
            this.scrollToTop();
        }

        if (prevProps.data !== this.props.data) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                data: this.props.data
            });
        }
    }
    handleSelect (id, event) {
        if (event.shiftKey !== true) {
            this.handleClose();
        }
        this.props.onItemSelected(this.getFilteredData()[id]);
    }
    handleClose () {
        this.props.onRequestClose();
    }
    handleTagClick (tag, enabled) {
        // console.log(tag, enabled);
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: '',
                selectedTags: this.state.selectedTags.concat([tag.toLowerCase()])
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: '',
                playingItem: null,
                selectedTags: this.state.selectedTags.concat([tag.toLowerCase()])
            });
        }
        if (!enabled) {
            const tags = this.state.selectedTags.filter(t => (t !== tag));
            this.setState({
                selectedTags: tags
            });
        }
    }
    handleMouseEnter (id) {
        // don't restart if mouse over already playing item
        if (this.props.onItemMouseEnter && this.state.playingItem !== id) {
            this.props.onItemMouseEnter(this.getFilteredData()[id]);
            this.setState({
                playingItem: id
            });
        }
    }
    handleMouseLeave (id) {
        if (this.props.onItemMouseLeave) {
            this.props.onItemMouseLeave(this.getFilteredData()[id]);
            this.setState({
                playingItem: null
            });
        }
    }
    handlePlayingEnd () {
        if (this.state.playingItem !== null) {
            this.setState({
                playingItem: null
            });
        }
    }
    handleFilterChange (event) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: event.target.value,
                selectedTags: []
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: event.target.value,
                playingItem: null,
                selectedTags: []
            });
        }
    }
    handleFilterClear () {
        this.setState({filterQuery: ''});
    }
    createFilteredData () {
        if (this.state.selectedTags.length <= 0) {
            if (!this.state.filterQuery) return this.state.data;
            return this.state.data.filter(dataItem => (
                (dataItem.tags || [])
                    // Second argument to map sets `this`
                    .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                    .concat(dataItem.name ?
                        (typeof dataItem.name === 'string' ?
                        // Use the name if it is a string, else use formatMessage to get the translated name
                            dataItem.name : this.props.intl.formatMessage(dataItem.name.props)
                        ).toLowerCase() :
                        null)
                    .join('\n') // unlikely to partially match newlines
                    .indexOf(this.state.filterQuery.toLowerCase()) !== -1
            ));
        }
        return this.state.data.filter(dataItem => (arrayIncludesItemsFrom(
            dataItem.tags &&
            dataItem.tags
                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase),
        this.state.selectedTags)));
    }
    getFilteredData () {
        const filtered = this.createFilteredData();

        if (this.props.actor !== "ExtensionLibrary") {
            return filtered;
        }

        const final = [].concat(
            this.state.favorites
                .filter(item => (typeof item !== "string"))
                .map(item => ({ ...item, custom: true }))
                .reverse(),
            filtered.filter(item => (this.state.favorites.includes(item.extensionId))),
            filtered.filter(item => (!this.state.favorites.includes(item.extensionId)))
        ).map(item => ({ ...item, custom: typeof item.custom === "boolean" ? item.custom : false }));
        
        return final;
    }
    scrollToTop () {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef (ref) {
        this.filteredDataRef = ref;
    }
    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                {/*
                    todo: translation support?
                */}
                {this.props.header ? (
                    <h1
                        className={classNames(
                            styles.libraryHeader,
                            styles.whiteTextInDarkMode
                        )}
                    >
                        <button
                            style={this.state.collapsed ? { transform: "scaleX(0.65)" } : null}
                            className={classNames(styles.libraryFilterCollapse)}
                            onClick={() => {
                                this.setState({
                                    collapsed: !this.state.collapsed
                                });
                            }}
                        />
                        {this.props.header}
                        <p
                            className={classNames(styles.libraryItemCount)}
                        >
                            {this.state.data.length}
                        </p>
                    </h1>
                ) : null}
                {/* filter bar & stuff */}
                <div className={classNames(styles.libraryContentWrapper)}>
                    <div
                        className={classNames(styles.libraryFilterBar)}
                        style={this.state.collapsed ? { display: "none" } : null}
                    >
                        {/*
                            todo: translation?
                        */}
                        <h3 className={classNames(styles.whiteTextInDarkMode)}>Filters</h3>
                        {this.props.filterable && (
                            <div>
                                    <Filter
                                        className={classNames(
                                            styles.filterBarItem,
                                            styles.filter
                                        )}
                                        filterQuery={this.state.filterQuery}
                                        inputClassName={styles.filterInput}
                                        placeholderText={this.props.intl.formatMessage(messages.filterPlaceholder)}
                                        onChange={this.handleFilterChange}
                                        onClear={this.handleFilterClear}
                                    />
                                <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                            </div>
                        )}
                        {this.props.tags &&
                            <div>
                                {tagListPrefix.concat(this.props.tags).map((tagProps, id) => {
                                    let onclick = this.handleTagClick;
                                    if (tagProps.type === 'divider') {
                                        return (<Divider className={classNames(styles.filterBarItem, styles.divider)} />);
                                    }
                                    if (tagProps.type === 'title') {
                                        return (<h3 className={classNames(styles.whiteTextInDarkMode)}>{tagProps.intlLabel}</h3>);
                                    }
                                    if (tagProps.type === 'subtitle') {
                                        return (<h5 className={classNames(styles.whiteTextInDarkMode)}>{tagProps.intlLabel}</h5>);
                                    }
                                    if (tagProps.type === 'custom') {
                                        onclick = () => {
                                            const api = {};
                                            api.useTag = this.handleTagClick;
                                            api.close = this.handleClose;
                                            api.select = (id) => {
                                                const items = this.state.data;
                                                for (const item of items) {
                                                    if (item.extensionId === id) {
                                                        this.handleClose();
                                                        this.props.onItemSelected(item);
                                                        return;
                                                    };
                                                }
                                            };
                                            tagProps.func(api);
                                        };
                                        return (
                                            <TagButton
                                                active={false}
                                                className={classNames(
                                                    styles.filterBarItem,
                                                    styles.tagButton,
                                                    tagProps.className
                                                )}
                                                key={`tag-button-${id}`}
                                                onClick={onclick}
                                                {...tagProps}
                                            />
                                        );
                                    }
                                    return (
                                        <div className={classNames(styles.tagCheckboxWrapper)}>
                                            <div style={{ width: "90%" }}>
                                                <TagCheckbox
                                                    active={false}
                                                    key={`tag-button-${id}`}
                                                    onClick={onclick}
                                                    {...tagProps}
                                                />
                                            </div>
                                            <div className={styles.libraryTagCount}>
                                                {this.state.loaded &&
                                                    (
                                                        this.state.data.filter(dataItem => (arrayIncludesItemsFrom(
                                                            dataItem.tags &&
                                                            dataItem.tags
                                                                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase),
                                                            [tagProps.tag]))).length
                                                    )
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        }
                    </div>
                    <div
                        className={classNames(styles.libraryScrollGrid)}
                        ref={this.setFilteredDataRef}
                    >
                        {this.state.loaded ? this.getFilteredData().map((dataItem, index) => (
                            <LibraryItem
                                bluetoothRequired={dataItem.bluetoothRequired}
                                collaborator={dataItem.collaborator}
                                extDeveloper={dataItem.extDeveloper}
                                credits={dataItem.credits}
                                twDeveloper={dataItem.twDeveloper}
                                eventSubmittor={dataItem.eventSubmittor}
                                extraLabels={dataItem.extraLabels}
                                customInsetColor={dataItem.customInsetColor}
                                description={dataItem.description}
                                disabled={dataItem.disabled}
                                extensionId={dataItem.extensionId}
                                featured={dataItem.featured}
                                hidden={dataItem.hidden}
                                isNew={dataItem.tags && dataItem.tags.includes("new")}
                                href={dataItem.href}
                                iconMd5={dataItem.costumes ? dataItem.costumes[0].md5ext : dataItem.md5ext}
                                iconRawURL={this.props.actor === "CostumeLibrary" ? `${PM_LIBRARY_API}files/${dataItem.libraryFilePage}` : dataItem.rawURL}
                                overlayURL={dataItem.overlayURL}
                                icons={dataItem.costumes}
                                id={index}
                                _id={dataItem._id}
                                styleForSound={this.props.actor === "SoundLibrary"}
                                soundType={dataItem.soundType}
                                soundLength={dataItem.soundLength}
                                incompatibleWithScratch={dataItem.incompatibleWithScratch}
                                extensionWarningOnImport={dataItem.extensionWarningOnImport}
                                insetIconURL={dataItem.insetIconURL}
                                internetConnectionRequired={dataItem.internetConnectionRequired}
                                isPlaying={this.state.playingItem === index}
                                key={typeof dataItem.name === 'string' ? dataItem.name : dataItem.rawURL}
                                name={dataItem.name}
                                showPlayButton={this.props.showPlayButton}
                                onMouseEnter={this.handleMouseEnter}
                                onMouseLeave={this.handleMouseLeave}
                                onSelect={this.handleSelect}

                                favoritable={this.props.actor === "ExtensionLibrary" && dataItem.extensionId}
                                favorited={this.state.favorites.includes(dataItem.extensionId)}
                                deletable={dataItem.deletable}
                                custom={dataItem.custom}
                                onFavoriteUpdated={() => this.handleFavoritesUpdate()}
                                _unsandboxed={dataItem._unsandboxed}
                            />
                        )) : (
                            <div className={styles.spinnerWrapper}>
                                <Spinner
                                    large
                                    level="primary"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
}

LibraryComponent.propTypes = {
    data: PropTypes.oneOfType([PropTypes.arrayOf(
        /* eslint-disable react/no-unused-prop-types, lines-around-comment */
        // An item in the library
        PropTypes.shape({
            // @todo remove md5/rawURL prop from library, refactor to use storage
            md5: PropTypes.string,
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
            rawURL: PropTypes.string
        })
        /* eslint-enable react/no-unused-prop-types, lines-around-comment */
    ), PropTypes.instanceOf(Promise)]),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    setStopHandler: PropTypes.func,
    showPlayButton: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired
};

LibraryComponent.defaultProps = {
    filterable: true,
    showPlayButton: false
};

export default injectIntl(LibraryComponent);
