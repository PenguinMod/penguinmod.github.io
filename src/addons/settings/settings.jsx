/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Search from './search';
import importedAddons from '../generated/addon-manifests';
import messagesByLocale from '../generated/l10n-settings-entries';
import settingsTranslationsEnglish from './en.json';
import settingsTranslationsOther from './translations.json';
import upstreamMeta from '../generated/upstream-meta.json';
import { detectLocale } from '../../lib/detect-locale';
import { getInitialDarkMode } from '../../lib/tw-theme-hoc.jsx';
import SettingsStore from '../settings-store-singleton';
import Channels from '../channels';
import extensionImage from './icons/extension.svg';
import brushImage from './icons/brush.svg';
import undoImage from './icons/undo.svg';
import expandImageBlack from './icons/expand.svg';
import infoImage from './icons/info.svg';
import styles from './settings.css';
import '../polyfill';
import '../../lib/normalize.css';

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

const locale = detectLocale(Object.keys(messagesByLocale));
document.documentElement.lang = locale;

const addonTranslations = messagesByLocale[locale] ? messagesByLocale[locale]() : {};

const settingsTranslations = settingsTranslationsEnglish;
if (locale !== 'en') {
    const messages = settingsTranslationsOther[locale] || settingsTranslationsOther[locale.split('-')[0]];
    if (messages) {
        Object.assign(settingsTranslations, messages);
    }
}

document.title = `${settingsTranslations.title} - GreenMod`; // PLEASE. THIS HAS TO BE IT.

const theme = 'dark' //getInitialDarkMode() ? 'dark' : 'light'; // lols
document.body.setAttribute('theme', theme);

let _throttleTimeout;
const postThrottledSettingsChange = store => {
    if (_throttleTimeout) {
        clearTimeout(_throttleTimeout);
    }
    _throttleTimeout = setTimeout(() => {
        Channels.changeChannel.postMessage({
            version: upstreamMeta.commit,
            store
        });
    }, 100);
};

const filterAddonsBySupport = () => {
    const supported = {};
    const unsupported = {};
    for (const [id, manifest] of Object.entries(importedAddons)) {
        if (manifest.unsupported) {
            unsupported[id] = manifest;
        } else {
            supported[id] = manifest;
        }
    }
    return {
        supported,
        unsupported
    };
};
const { supported: supportedAddons, unsupported: unsupportedAddons } = filterAddonsBySupport();

const groupAddons = () => {
    const groups = {
        new: {
            label: settingsTranslations.groupNew,
            open: true,
            addons: []
        },
        others: {
            label: settingsTranslations.groupOthers,
            open: true,
            addons: []
        },
        danger: {
            label: settingsTranslations.groupDanger,
            open: false,
            addons: []
        }
    };
    const manifests = Object.values(supportedAddons);
    for (let index = 0; index < manifests.length; index++) {
        const manifest = manifests[index];
        if (manifest.tags.includes('new')) {
            groups.new.addons.push(index);
        } else if (manifest.tags.includes('danger') || manifest.noCompiler) {
            groups.danger.addons.push(index);
        } else {
            groups.others.addons.push(index);
        }
    }
    return groups;
};
const groupedAddons = groupAddons();

const CreditList = ({ credits }) => (
    credits.map((author, index) => {
        const isLast = index === credits.length - 1;
        return (
            <span
                className={styles.credit}
                key={index}
            >
                {author.link ? (
                    <a
                        href={author.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {author.name}
                    </a>
                ) : (
                    <span>
                        {author.name}
                    </span>
                )}
                {isLast ? null : ', '}
            </span>
        );
    })
);
CreditList.propTypes = {
    credits: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        link: PropTypes.string
    }))
};

const Switch = ({ onChange, value, ...props }) => (
    <button
        className={styles.switch}
        state={value ? 'on' : 'off'}
        role="checkbox"
        aria-checked={value ? 'true' : 'false'}
        tabIndex="0"
        onClick={() => onChange(!value)}
        {...props}
    />
);
Switch.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.bool
};

const Select = ({
    onChange,
    value,
    values
}) => (
    <div className={styles.select}>
        {values.map(potentialValue => {
            const id = potentialValue.id;
            const selected = id === value;
            return (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={classNames(styles.selectOption, { [styles.selected]: selected })}
                >
                    {potentialValue.name}
                </button>
            );
        })}
    </div>
);
Select.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    }))
};

const Tags = ({ manifest }) => (
    <span className={styles.tagContainer}>
        {manifest.tags.includes('recommended') && (
            <span className={classNames(styles.tag, styles.tagRecommended)}>
                {settingsTranslations.tagRecommended}
            </span>
        )}
        {manifest.tags.includes('theme') && (
            <span className={classNames(styles.tag, styles.tagTheme)}>
                {settingsTranslations.tagTheme}
            </span>
        )}
        {manifest.tags.includes('beta') && (
            <span className={classNames(styles.tag, styles.tagBeta)}>
                {settingsTranslations.tagBeta}
            </span>
        )}
        {manifest.tags.includes('new') && (
            <span className={classNames(styles.tag, styles.tagNew)}>
                {settingsTranslations.tagNew}
            </span>
        )}
        {manifest.tags.includes('danger') && (
            <span className={classNames(styles.tag, styles.tagDanger)}>
                {settingsTranslations.tagDanger}
            </span>
        )}
    </span>
);
Tags.propTypes = {
    manifest: PropTypes.shape({
        tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    }).isRequired
};

class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleFlush = this.handleFlush.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: null,
            focused: false
        };
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleFlush(e);
            e.target.blur();
        }
    }
    handleFocus() {
        this.setState({
            focused: true
        });
    }
    handleFlush(e) {
        this.setState({
            focused: false
        });
        if (this.state.value === null) {
            return;
        }
        if (this.props.type === 'number') {
            let value = +this.state.value;
            const min = e.target.min;
            const max = e.target.max;
            const step = e.target.step;
            if (min !== '') value = Math.max(min, value);
            if (max !== '') value = Math.min(max, value);
            if (step === '1') value = Math.round(value);
            this.props.onChange(value);
        } else {
            this.props.onChange(this.state.value);
        }
        this.setState({ value: null });
    }
    handleChange(e) {
        e.persist();
        this.setState({ value: e.target.value }, () => {
            // A change event can be fired when not focused by using the browser's number spinners
            if (!this.state.focused) {
                this.handleFlush(e);
            }
        });
    }
    render() {
        return (
            <input
                {...this.props}
                value={this.state.value === null ? this.props.value : this.state.value}
                onFocus={this.handleFocus}
                onBlur={this.handleFlush}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
            />
        );
    }
}
TextInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const ColorInput = props => (
    <input
        type="color"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
    />
);
ColorInput.propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

const ResetButton = ({
    addonId,
    settingId,
    forTextInput
}) => (
    <button
        className={classNames(styles.button, styles.resetSettingButton)}
        onClick={() => SettingsStore.setAddonSetting(addonId, settingId, null)}
        title={settingsTranslations.reset}
        data-for-text-input={forTextInput}
    >
        <img
            src={undoImage}
            alt={settingsTranslations.reset}
        />
    </button>
);
ResetButton.propTypes = {
    addonId: PropTypes.string,
    settingId: PropTypes.string,
    forTextInput: PropTypes.bool
};

const Setting = ({
    addonId,
    setting,
    value
}) => {
    if (!SettingsStore.evaluateCondition(addonId, setting.if)) {
        return null;
    }
    const settingId = setting.id;
    const settingName = addonTranslations[`${addonId}/@settings-name-${settingId}`] || setting.name;
    const uniqueId = `setting/${addonId}/${settingId}`;
    const label = (
        <label
            htmlFor={uniqueId}
            className={styles.settingLabel}
        >
            {settingName}
        </label>
    );
    return (
        <div
            className={styles.setting}
        >
            {setting.type === 'boolean' && (
                <React.Fragment>
                    {label}
                    <input
                        id={uniqueId}
                        type="checkbox"
                        checked={value}
                        onChange={e => SettingsStore.setAddonSetting(addonId, settingId, e.target.checked)}
                    />
                </React.Fragment>
            )}
            {setting.type === 'integer' && (
                <React.Fragment>
                    {label}
                    <TextInput
                        id={uniqueId}
                        type="number"
                        min={setting.min}
                        max={setting.max}
                        step="1"
                        value={value}
                        onChange={newValue => SettingsStore.setAddonSetting(addonId, settingId, newValue)}
                    />
                    <ResetButton
                        addonId={addonId}
                        settingId={settingId}
                        forTextInput
                    />
                </React.Fragment>
            )}
            {setting.type === 'color' && (
                <React.Fragment>
                    {label}
                    <ColorInput
                        id={uniqueId}
                        value={value}
                        onChange={e => SettingsStore.setAddonSetting(addonId, settingId, e.target.value)}
                    />
                    <ResetButton
                        addonId={addonId}
                        settingId={settingId}
                    />
                </React.Fragment>
            )}
            {setting.type === 'select' && (
                <React.Fragment>
                    {label}
                    <Select
                        value={value}
                        values={setting.potentialValues.map(({ id, name }) => ({
                            id,
                            name: addonTranslations[`${addonId}/@settings-select-${settingId}-${id}`] || name
                        }))}
                        onChange={v => SettingsStore.setAddonSetting(addonId, settingId, v)}
                        setting={setting}
                    />
                </React.Fragment>
            )}
        </div>
    );
};
Setting.propTypes = {
    addonId: PropTypes.string,
    setting: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        default: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        potentialValues: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })),
        if: PropTypes.shape({
            addonEnabled: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
            // eslint-disable-next-line react/forbid-prop-types
            settings: PropTypes.object
        })
    }),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])
};

const Notice = ({
    type,
    text
}) => (
    <div
        className={styles.notice}
        type={type}
    >
        <div>
            <img
                className={styles.noticeIcon}
                src={infoImage}
                alt=""
                draggable={false}
            />
        </div>
        <div>
            {text}
        </div>
    </div>
);
Notice.propTypes = {
    type: PropTypes.string,
    text: PropTypes.string
};

const Presets = ({
    addonId,
    presets
}) => (
    <div className={classNames(styles.setting, styles.presets)}>
        <div className={styles.settingLabel}>
            {settingsTranslations.presets}
        </div>
        {presets.map(preset => {
            const presetId = preset.id;
            const name = addonTranslations[`${addonId}/@preset-name-${presetId}`] || preset.name;
            const description = addonTranslations[`${addonId}/@preset-description-${presetId}`] || preset.description;
            return (
                <button
                    key={presetId}
                    title={description}
                    className={classNames(styles.button, styles.presetButton)}
                    onClick={() => SettingsStore.applyAddonPreset(addonId, presetId)}
                >
                    {name}
                </button>
            );
        })}
    </div>
);
Presets.propTypes = {
    addonId: PropTypes.string,
    presets: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        description: PropTypes.string,
        values: PropTypes.shape({})
    }))
};

const Addon = ({
    id,
    settings,
    manifest,
    extended
}) => (
    <div className={classNames(styles.addon, { [styles.addonDirty]: settings.dirty })}>
        <div className={styles.addonHeader}>
            <label className={styles.addonTitle}>
                <div className={styles.addonSwitch}>
                    <Switch
                        value={settings.enabled}
                        onChange={value => {
                            if (
                                !value ||
                                !manifest.tags.includes('danger') ||
                                confirm(settingsTranslations.enableDangerous)
                            ) {
                                SettingsStore.setAddonEnabled(id, value);
                            }
                        }}
                    />
                </div>
                {manifest.tags.includes('theme') ? (
                    <img
                        className={styles.extensionImage}
                        src={brushImage}
                        draggable={false}
                        alt=""
                    />
                ) : (
                    <img
                        className={styles.extensionImage}
                        src={extensionImage}
                        draggable={false}
                        alt=""
                    />
                )}
                <div className={styles.addonTitleText}>
                    {addonTranslations[`${id}/@name`] || manifest.name}
                </div>
                {extended && (
                    <div className={styles.addonId}>
                        {`(${id})`}
                    </div>
                )}
            </label>
            <Tags manifest={manifest} />
            {!settings.enabled && (
                <div className={styles.inlineDescription}>
                    {addonTranslations[`${id}/@description`] || manifest.description}
                </div>
            )}
            <div className={styles.addonOperations}>
                {settings.enabled && manifest.settings && (
                    <button
                        className={styles.resetButton}
                        onClick={() => SettingsStore.resetAddon(id)}
                        title={settingsTranslations.reset}
                    >
                        <img
                            src={undoImage}
                            className={styles.resetButtonImage}
                            alt={settingsTranslations.reset}
                            draggable={false}
                        />
                    </button>
                )}
            </div>
        </div>
        {settings.enabled && (
            <div className={styles.addonDetails}>
                <div className={styles.description}>
                    {addonTranslations[`${id}/@description`] || manifest.description}
                </div>
                {manifest.credits && (
                    <div className={styles.creditContainer}>
                        <span className={styles.creditTitle}>
                            {settingsTranslations.credits}
                        </span>
                        <CreditList credits={manifest.credits} />
                    </div>
                )}
                {manifest.info && (
                    manifest.info.map(info => (
                        <Notice
                            key={info.id}
                            type={info.type}
                            text={addonTranslations[`${id}/@info-${info.id}`] || info.text}
                        />
                    ))
                )}
                {manifest.noCompiler && (
                    <Notice
                        type="warning"
                        text={settingsTranslations.noCompiler}
                    />
                )}
                {manifest.settings && (
                    <div className={styles.settingContainer}>
                        {manifest.settings.map(setting => (
                            <Setting
                                key={setting.id}
                                addonId={id}
                                setting={setting}
                                value={settings[setting.id]}
                            />
                        ))}
                        {manifest.presets && (
                            <Presets
                                addonId={id}
                                presets={manifest.presets}
                            />
                        )}
                    </div>
                )}
            </div>
        )}
    </div>
);
Addon.propTypes = {
    id: PropTypes.string,
    settings: PropTypes.shape({
        enabled: PropTypes.bool,
        dirty: PropTypes.bool
    }),
    manifest: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        credits: PropTypes.arrayOf(PropTypes.shape({})),
        info: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string
        })),
        settings: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string
        })),
        presets: PropTypes.arrayOf(PropTypes.shape({})),
        tags: PropTypes.arrayOf(PropTypes.string),
        noCompiler: PropTypes.bool
    }),
    extended: PropTypes.bool
};

const Dirty = props => (
    <div className={styles.dirtyOuter}>
        <div className={styles.dirtyInner}>
            {settingsTranslations.dirty}
            {props.onReloadNow && (
                <button
                    className={classNames(styles.button, styles.dirtyButton)}
                    onClick={props.onReloadNow}
                >
                    {settingsTranslations.dirtyButton}
                </button>
            )}
        </div>
    </div>
);
Dirty.propTypes = {
    onReloadNow: PropTypes.func
};

const UnsupportedAddons = ({ addons: addonList }) => (
    <div className={styles.unsupportedContainer}>
        <span className={styles.unsupportedText}>
            {settingsTranslations.unsupported}
        </span>
        {addonList.map(({ id, manifest }, index) => (
            <span
                key={id}
                className={styles.unsupportedAddon}
            >
                {addonTranslations[`${id}/@name`] || manifest.name}
                {index !== addonList.length - 1 && (
                    ', '
                )}
            </span>
        ))}
    </div>
);
UnsupportedAddons.propTypes = {
    addons: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        manifest: PropTypes.shape({
            name: PropTypes.string
        })
    }))
};

const InternalAddonList = ({ addons, extended }) => (
    addons.map(({ id, manifest, state }) => (
        <Addon
            key={id}
            id={id}
            settings={state}
            manifest={manifest}
            extended={extended}
        />
    ))
);

class AddonGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        };
    }
    render() {
        if (this.props.addons.length === 0) {
            return null;
        }
        return (
            <div className={styles.addonGroup}>
                <button
                    className={styles.addonGroupName}
                    onClick={() => {
                        this.setState({
                            open: !this.state.open
                        });
                    }}
                >
                    <img
                        className={styles.addonGroupExpand}
                        src={expandImageBlack}
                        data-open={this.state.open}
                        alt=""
                    />
                    {this.props.label.replace('{number}', this.props.addons.length)}
                </button>
                {this.state.open && (
                    <InternalAddonList
                        addons={this.props.addons}
                        extended={this.props.extended}
                    />
                )}
            </div>
        );
    }
}
AddonGroup.propTypes = {
    label: PropTypes.string,
    open: PropTypes.bool,
    addons: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        state: PropTypes.shape({}).isRequired,
        manifest: PropTypes.shape({}).isRequired
    })).isRequired,
    extended: PropTypes.bool.isRequired
};

const addonToSearchItem = ({ id, manifest }) => {
    const texts = new Set();
    const addText = (score, text) => {
        if (text) {
            texts.add({
                score,
                text
            });
        }
    };
    addText(1, id);
    addText(1, manifest.name);
    addText(1, addonTranslations[`${id}/@name`]);
    addText(0.5, manifest.description);
    addText(0.5, addonTranslations[`${id}/@description`]);
    if (manifest.settings) {
        for (const setting of manifest.settings) {
            addText(0.25, setting.name);
            addText(0.25, addonTranslations[`${id}/@settings-name-${setting.id}`]);
        }
    }
    if (manifest.presets) {
        for (const preset of manifest.presets) {
            addText(0.1, preset.name);
            addText(0.1, addonTranslations[`${id}/@preset-name-${preset.id}`]);
            addText(0.1, preset.description);
            addText(0.1, addonTranslations[`${id}/@preset-description-${preset.id}`]);
        }
    }
    for (const tag of manifest.tags) {
        const key = `tags.${tag}`;
        if (settingsTranslations[key]) {
            addText(0.25, settingsTranslations[key]);
        }
    }
    if (manifest.info) {
        for (const info of manifest.info) {
            addText(0.25, info.text);
            addText(0.25, addonTranslations[`${id}/@info-${info.id}`]);
        }
    }
    return texts;
};

class AddonList extends React.Component {
    constructor(props) {
        super(props);
        this.search = new Search(this.props.addons.map(addonToSearchItem));
        this.groups = [];
    }
    render() {
        if (this.props.search) {
            const addons = this.search.search(this.props.search)
                .slice(0, 20)
                .map(({ index }) => this.props.addons[index]);
            if (addons.length === 0) {
                return (
                    <div className={styles.noResults}>
                        {settingsTranslations.noResults}
                    </div>
                );
            }
            return (
                <div>
                    <InternalAddonList
                        addons={addons}
                        extended={this.props.extended}
                    />
                </div>
            );
        }
        return (
            <div>
                {Object.entries(groupedAddons).map(([id, { label, addons, open }]) => (
                    <AddonGroup
                        key={id}
                        label={label}
                        open={open}
                        addons={addons.map(index => this.props.addons[index])}
                        extended={this.props.extended}
                    />
                ))}
            </div>
        );
    }
}
AddonList.propTypes = {
    addons: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        state: PropTypes.shape({}).isRequired,
        manifest: PropTypes.shape({}).isRequired
    })).isRequired,
    search: PropTypes.string.isRequired,
    extended: PropTypes.bool.isRequired
};

class AddonSettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleSettingStoreChanged = this.handleSettingStoreChanged.bind(this);
        this.handleReloadNow = this.handleReloadNow.bind(this);
        this.handleResetAll = this.handleResetAll.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleImport = this.handleImport.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClickSearchButton = this.handleClickSearchButton.bind(this);
        this.handleClickVersion = this.handleClickVersion.bind(this);
        this.searchRef = this.searchRef.bind(this);
        this.searchBar = null;
        this.state = {
            loading: false,
            dirty: false,
            search: location.hash ? location.hash.substr(1) : '',
            extended: false,
            ...this.readFullAddonState()
        };
        if (Channels.changeChannel) {
            Channels.changeChannel.addEventListener('message', () => {
                SettingsStore.readLocalStorage();
                this.setState(this.readFullAddonState());
            });
        }
    }
    componentDidMount() {
        SettingsStore.addEventListener('setting-changed', this.handleSettingStoreChanged);
        document.body.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        SettingsStore.removeEventListener('setting-changed', this.handleSettingStoreChanged);
        document.body.removeEventListener('keydown', this.handleKeyDown);
    }
    readFullAddonState() {
        const result = {};
        for (const [id, manifest] of Object.entries(supportedAddons)) {
            const enabled = SettingsStore.getAddonEnabled(id);
            const addonState = {
                enabled: enabled,
                dirty: false
            };
            if (manifest.settings) {
                for (const setting of manifest.settings) {
                    addonState[setting.id] = SettingsStore.getAddonSetting(id, setting.id);
                }
            }
            result[id] = addonState;
        }
        return result;
    }
    handleSettingStoreChanged(e) {
        const { addonId, settingId, value } = e.detail;
        // If channels are unavailable, every change requires reload.
        const reloadRequired = e.detail.reloadRequired || !Channels.changeChannel;
        this.setState(state => {
            const newState = {
                [addonId]: {
                    ...state[addonId],
                    [settingId]: value,
                    dirty: true
                }
            };
            if (reloadRequired) {
                newState.dirty = true;
            }
            return newState;
        });
        if (!reloadRequired) {
            postThrottledSettingsChange(SettingsStore.store);
        }
    }
    handleReloadNow() {
        // Value posted does not matter
        Channels.reloadChannel.postMessage(0);
        this.setState({
            dirty: false
        });
        for (const addonId of Object.keys(supportedAddons)) {
            if (this.state[addonId].dirty) {
                this.setState(state => ({
                    [addonId]: {
                        ...state[addonId],
                        dirty: false
                    }
                }));
            }
        }
    }
    handleResetAll() {
        if (confirm(settingsTranslations.confirmResetAll)) {
            SettingsStore.resetAllAddons();
            this.setState({
                search: ''
            });
        }
    }
    handleExport() {
        const exportedData = SettingsStore.export({
            theme
        });
        this.props.onExportSettings(exportedData);
    }
    handleImport() {
        const fileSelector = document.createElement('input');
        fileSelector.type = 'file';
        fileSelector.accept = '.json';
        document.body.appendChild(fileSelector);
        fileSelector.click();
        document.body.removeChild(fileSelector);
        fileSelector.addEventListener('change', async () => {
            const file = fileSelector.files[0];
            if (!file) {
                return;
            }
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                SettingsStore.import(data);
                this.setState({
                    search: ''
                });
            } catch (e) {
                console.error(e);
                alert(e);
            }
        });
    }
    handleSearch(e) {
        const value = e.target.value;
        this.setState({
            search: value
        });
    }
    handleClickSearchButton() {
        this.setState({
            search: ''
        });
        this.searchBar.focus();
    }
    handleClickVersion() {
        this.setState({
            extended: !this.state.extended
        });
    }
    searchRef(searchBar) {
        this.searchBar = searchBar;
    }
    handleKeyDown(e) {
        const key = e.key;
        if (key.length === 1 && key !== ' ' && e.target === document.body && !(e.ctrlKey || e.metaKey || e.altKey)) {
            this.searchBar.focus();
        }
        // Only preventDefault() if the search bar isn't already focused so
        // that we don't break the browser's builtin ctrl+f
        if (key === 'f' && (e.ctrlKey || e.metaKey) && document.activeElement !== this.searchBar) {
            this.searchBar.focus();
            e.preventDefault();
        }
    }
    render() {
        const addonState = Object.entries(supportedAddons).map(([id, manifest]) => ({
            id,
            manifest,
            state: this.state[id]
        }));
        const unsupported = Object.entries(unsupportedAddons).map(([id, manifest]) => ({
            id,
            manifest
        }));
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.section}>
                        <div className={styles.searchContainer}>
                            <input
                                className={styles.searchInput}
                                value={this.state.search}
                                onChange={this.handleSearch}
                                placeholder={settingsTranslations.search}
                                aria-label={settingsTranslations.search}
                                ref={this.searchRef}
                                spellCheck="false"
                                autoFocus
                            />
                            <div
                                className={styles.searchButton}
                                onClick={this.handleClickSearchButton}
                            />
                        </div>
                        <a
                            href="https://discord.gg/NZ9MBMYTZh"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.feedbackButtonOuter}
                        >
                            <span className={styles.feedbackButtonInner}>
                                {settingsTranslations.addonFeedback}
                            </span>
                        </a>
                    </div>
                    {this.state.dirty && (
                        <Dirty
                            onReloadNow={Channels.reloadChannel ? this.handleReloadNow : null}
                        />
                    )}
                </div>
                <div className={styles.addons}>
                    {!this.state.loading && (
                        <div className={styles.section}>
                            <AddonList
                                addons={addonState}
                                search={this.state.search}
                                extended={this.state.extended}
                            />
                            <div className={styles.footerButtons}>
                                <button
                                    className={classNames(styles.button, styles.resetAllButton)}
                                    onClick={this.handleResetAll}
                                >
                                    {settingsTranslations.resetAll}
                                </button>
                                <button
                                    className={classNames(styles.button, styles.exportButton)}
                                    onClick={this.handleExport}
                                >
                                    {settingsTranslations.export}
                                </button>
                                <button
                                    className={classNames(styles.button, styles.importButton)}
                                    onClick={this.handleImport}
                                >
                                    {settingsTranslations.import}
                                </button>
                            </div>
                            <footer className={styles.footer}>
                                {unsupported.length ? (
                                    <UnsupportedAddons
                                        addons={unsupported}
                                    />
                                ) : null}
                                <span
                                    className={styles.version}
                                    onClick={this.handleClickVersion}
                                >
                                    {this.state.extended ?
                                        // Don't bother translating, pretty much no one will ever see this.
                                        // eslint-disable-next-line max-len
                                        `You have enabled debug mode. (Addons version ${upstreamMeta.commit})` :
                                        `Addons version ${upstreamMeta.commit}`}
                                </span>
                            </footer>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
AddonSettingsComponent.propTypes = {
    onExportSettings: PropTypes.func
};

export default AddonSettingsComponent;
