import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from "react-draggable";
import {ContextMenuTrigger} from 'react-contextmenu';
import {BorderedMenuItem, ContextMenu, DangerousMenuItem, MenuItem} from '../context-menu/context-menu.jsx';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import VariablesTab from '../../containers/variables-tab.jsx';
import FilesTab from '../../containers/files-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';

import Backpack from '../../containers/backpack.jsx';
import BrowserModal from '../browser-modal/browser-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import TWUsernameModal from '../../containers/tw-username-modal.jsx';
import TWSettingsModal from '../../containers/tw-settings-modal.jsx';
import TWSecurityManager from '../../containers/tw-security-manager.jsx';
import TWCustomExtensionModal from '../../containers/tw-custom-extension-modal.jsx';
import TWRestorePointManager from '../../containers/tw-restore-point-manager.jsx';
import TWFontsModal from '../../containers/tw-fonts-modal.jsx';
import PMExtensionModals from '../../containers/pm-extension-modals.jsx';

import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';

import {isRendererSupported, isBrowserSupported} from '../../lib/tw-environment-support-prober';

import styles from './gui.css';
import plusIcon from './add-tab.svg';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';
import variablesIcon from './icon--variables.svg';
import filesIcon from './icon--files.svg';

const urlParams = new URLSearchParams(location.search);

const IsLocal = String(window.location.href).startsWith(`http://localhost:`);
const IsLiveTests = urlParams.has('livetests');

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

const getFullscreenBackgroundColor = () => {
    const params = new URLSearchParams(location.search);
    if (params.has('fullscreen-background')) {
        return params.get('fullscreen-background');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return '#111';
    }
    return 'white';
};

const safeJSONParse = (json, defaul, mustBeArray) => {
    try {
        const parsed = JSON.parse(json);
        if (mustBeArray && !Array.isArray(parsed)) throw 'Not array';
        return parsed;
    } catch {
        return defaul;
    }
};

const fullscreenBackgroundColor = getFullscreenBackgroundColor();

const GUIComponent = props => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        customStageSize,
        enableCommunity,
        intl,
        isCreating,
        isDark,
        isEmbedded,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isWindowFullScreen,
        isTelemetryEnabled,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onClickAddonSettings,
        onClickNewWindow,
        onClickTheme,
        onClickPackager,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateVariablesTab,
        onActivateFilesTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onStartFolderUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        showComingSoon,
        soundsTabVisible,
        variablesTabVisible,
        filesTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        tipsLibraryVisible,
        usernameModalVisible,
        settingsModalVisible,
        customExtensionModalVisible,
        fontsModalVisible,
        isPlayground,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    // We can't move this into it's own component or it'll break the selected tab styles & disable switching to the code tab
    // Moving the whole TabList element will also break the code panel from resizing properly
    const getTabOrder = () => {
        const tabOrderStr = localStorage.getItem('pm:taborder') || '["code", "costume", "sound"]';
        const tabOrder = safeJSONParse(tabOrderStr, [], true);

        return tabOrder;
    };
    const tabOrder = getTabOrder();
    
    const ContextMenuWrapTab = ({ children, ...props }) => {
        const {tabId} = props;
        const disabled = tabId === 'code';

        return (<><ContextMenuTrigger disable={disabled} id={`remove-editor-tab-${tabId}`}>
                {children}
            </ContextMenuTrigger>
            {ReactDOM.createPortal(<ContextMenu id={`remove-editor-tab-${tabId}`}>
                <DangerousMenuItem onClick={() => removeTabFromEditor(tabId)}>
                    <FormattedMessage
                        defaultMessage="delete"
                        description="Menu item to delete in the right click menu"
                        id="gui.spriteSelectorItem.contextMenuDelete"
                    />
                </DangerousMenuItem>
            </ContextMenu>, document.body)}
        </>);
    };

    // currently each tab can decide whether or not its hidden, remove this once rearranging tabs is supported
    const codeTab = (<Tab className={classNames(tabClassNames.tab, tabOrder.includes('code') ? null : styles.tabDisabled)}>
            <ContextMenuWrapTab tabId="code">
                <img
                    draggable={false}
                    src={codeIcon}
                />
                <FormattedMessage
                    defaultMessage="Code"
                    description="Button to get to the code panel"
                    id="gui.gui.codeTab"
                />
            </ContextMenuWrapTab>
        </Tab>);
    const costumesTab = (<Tab className={classNames(tabClassNames.tab, tabOrder.includes('costume') ? null : styles.tabDisabled)} onClick={onActivateCostumesTab}>
            <ContextMenuWrapTab tabId="costume">
                <img
                    draggable={false}
                    src={costumesIcon}
                />
                {targetIsStage ? (
                    <FormattedMessage
                        defaultMessage="Backdrops"
                        description="Button to get to the backdrops panel"
                        id="gui.gui.backdropsTab"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Costumes"
                        description="Button to get to the costumes panel"
                        id="gui.gui.costumesTab"
                    />
                )}
            </ContextMenuWrapTab>
        </Tab>);
    const soundsTab = (<Tab className={classNames(tabClassNames.tab, tabOrder.includes('sound') ? null : styles.tabDisabled)} onClick={onActivateSoundsTab}>
            <ContextMenuWrapTab tabId="sound">
                <img
                    draggable={false}
                    src={soundsIcon}
                />
                <FormattedMessage
                    defaultMessage="Sounds"
                    description="Button to get to the sounds panel"
                    id="gui.gui.soundsTab"
                />
            </ContextMenuWrapTab>
        </Tab>);
    const variablesTab = (<Tab className={classNames(tabClassNames.tab, tabOrder.includes('variable') ? null : styles.tabDisabled)} onClick={onActivateVariablesTab}>
            <ContextMenuWrapTab tabId="variable">
                <img
                    draggable={false}
                    src={variablesIcon}
                />
                <FormattedMessage
                    defaultMessage="Variables"
                    description="Button to get to the variables panel"
                    id="pm.gui.variablesTab"
                />
            </ContextMenuWrapTab>
        </Tab>);
    const filesTab = (<Tab className={classNames(tabClassNames.tab, tabOrder.includes('file') ? null : styles.tabDisabled)} onClick={onActivateFilesTab}>
            <ContextMenuWrapTab tabId="file">
                <img
                    draggable={false}
                    src={filesIcon}
                />
                <FormattedMessage
                    defaultMessage="Files"
                    description="Button to get to the files panel"
                    id="pm.gui.filesTab"
                />
            </ContextMenuWrapTab>
        </Tab>);

    const tabPairs = {
        code: codeTab,
        costume: costumesTab,
        sound: soundsTab,
        variable: variablesTab,
        // file: filesTab,
    };

    // For now, rearranging tabs is not supported
    const organizedTabs = Object.values(tabPairs);
    // const organizedTabs = (() => {
    //     const enabledTabs = [];
    //     // Either add in rearranged order
    //     // for (const tabId of tabOrder) {
    //     //     enabledTabs.push(tabPairs[tabId] || codeTab)
    //     // }
    //     // or we can add tabs in order of table inclusion
    //     // for (const key in tabPairs) {
    //     //     const tab = tabPairs[key];
    //     //     if (tabOrder.includes(key)) {
    //     //         enabledTabs.push(tab);
    //     //     }
    //     // }

    //     return enabledTabs;
    // })();
    const addTabButtonDisabled = tabOrder.length >= Object.keys(tabPairs).length;

    const addTabToEditor = (tabId) => {
        const tabOrder = getTabOrder();
        tabOrder.push(tabId);
        localStorage.setItem('pm:taborder', JSON.stringify(tabOrder));

        const tabKeys = Object.keys(tabPairs);
        const tabIndex = tabKeys.indexOf(tabId);
        if (tabIndex === -1) {
            return onActivateTab(0);
        }

        onActivateTab(tabIndex);
    };
    const removeTabFromEditor = (tabId) => {
        setTimeout(() => { // sometimes clicking delete will switch to the deleted tab
            const tabOrder = getTabOrder();
            const idx = tabOrder.indexOf(tabId);
            if (idx === -1) return;
    
            tabOrder.splice(idx, 1);
            localStorage.setItem('pm:taborder', JSON.stringify(tabOrder));

            if (tabId !== 'code') {
                return onActivateTab(0);
            }

            const tabKeys = Object.keys(tabPairs);
            const firstTab = tabOrder[0];
            const firstTabIdx = tabKeys.indexOf(firstTab);
            
            if (firstTabIdx !== -1) {
                onActivateTab(firstTabIdx);
            }
        });
    };

    const minWidth = layout.fullSizeMinWidth + Math.max(0, customStageSize.width - layout.referenceWidth);
    return (<MediaQuery minWidth={minWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);

        const alwaysEnabledModals = (
            <React.Fragment>
                <TWSecurityManager />
                <TWRestorePointManager />
                {usernameModalVisible && <TWUsernameModal />}
                {settingsModalVisible && <TWSettingsModal />}
                {customExtensionModalVisible && <TWCustomExtensionModal />}
                {fontsModalVisible && <TWFontsModal />}
                <PMExtensionModals vm={vm} />
            </React.Fragment>
        );

        return isPlayerOnly ? (
            <React.Fragment>
                {/* TW: When the window is fullscreen, use an element to display the background color */}
                {/* The default color for transparency is inconsistent between browsers and there isn't an existing */}
                {/* element for us to style that fills the entire screen. */}
                {isWindowFullScreen ? (
                    <div
                        className={styles.fullscreenBackground}
                        style={{
                            backgroundColor: fullscreenBackgroundColor
                        }}
                    />
                ) : null}
                <StageWrapper
                    isFullScreen={isFullScreen}
                    isEmbedded={isEmbedded}
                    isRendererSupported={isRendererSupported()}
                    isRtl={isRtl}
                    loading={loading}
                    stageSize={STAGE_SIZE_MODES.large}
                    vm={vm}
                >
                    {alertsVisible ? (
                        <Alerts className={styles.alertsContainer} />
                    ) : null}
                </StageWrapper>
                {alwaysEnabledModals}
            </React.Fragment>
        ) : (
            <Box
                className={styles.pageWrapper}
                dir={isRtl ? 'rtl' : 'ltr'}
                {...componentProps}
            >
                {alwaysEnabledModals}
                {telemetryModalVisible ? (
                    <TelemetryModal
                        isRtl={isRtl}
                        isTelemetryEnabled={isTelemetryEnabled}
                        onCancel={onTelemetryModalCancel}
                        onOptIn={onTelemetryModalOptIn}
                        onOptOut={onTelemetryModalOptOut}
                        onRequestClose={onRequestCloseTelemetryModal}
                        onShowPrivacyPolicy={onShowPrivacyPolicy}
                    />
                ) : null}
                {loading ? (
                    <Loader isFullScreen />
                ) : null}
                {isCreating ? (
                    <Loader
                        isFullScreen
                        messageId={isPlayground ? "pm.loader.playground" : "gui.loader.creating"}
                    />
                ) : null}
                {isBrowserSupported() ? null : (
                    <BrowserModal isRtl={isRtl} />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                {connectionModalVisible ? (
                    <ConnectionModal
                        vm={vm}
                    />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                {(!isPlayground) ? (
                    <MenuBar
                        accountNavOpen={accountNavOpen}
                        authorId={authorId}
                        authorThumbnailUrl={authorThumbnailUrl}
                        authorUsername={authorUsername}
                        canChangeLanguage={canChangeLanguage}
                        canCreateCopy={canCreateCopy}
                        canCreateNew={canCreateNew}
                        canEditTitle={canEditTitle}
                        canManageFiles={canManageFiles}
                        canRemix={canRemix}
                        canSave={canSave}
                        canShare={canShare}
                        className={styles.menuBarPosition}
                        enableCommunity={enableCommunity}
                        isDirectoryPickerSupported={!!window.showDirectoryPicker}
                        isShared={isShared}
                        logo={logo}
                        renderLogin={renderLogin}
                        showComingSoon={showComingSoon}
                        onClickAbout={onClickAbout}
                        onClickAccountNav={onClickAccountNav}
                        onClickAddonSettings={onClickAddonSettings}
                        onClickNewWindow={onClickNewWindow}
                        onClickTheme={onClickTheme}
                        onClickPackager={onClickPackager}
                        onClickLogo={onClickLogo}
                        onCloseAccountNav={onCloseAccountNav}
                        onLogOut={onLogOut}
                        onOpenRegistration={onOpenRegistration}
                        onProjectTelemetryEvent={onProjectTelemetryEvent}
                        onSeeCommunity={onSeeCommunity}
                        onShare={onShare}
                        onStartSelectingFileUpload={onStartSelectingFileUpload}
                        onStartFolderUpload={onStartFolderUpload}
                        onToggleLoginOpen={onToggleLoginOpen}
                    />
                ) : null}
                <Box className={classNames(styles.bodyWrapper, isPlayground ? styles.bodyWrapperPlayground : null)}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Tabs
                                forceRenderTabPanel
                                className={tabClassNames.tabs}
                                selectedIndex={activeTabIndex}
                                selectedTabClassName={tabClassNames.tabSelected}
                                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                onSelect={onActivateTab}
                            >
                                <TabList className={tabClassNames.tabList}>
                                    {organizedTabs}

                                    <ContextMenuTrigger
                                        disable={addTabButtonDisabled}
                                        holdToDisplay={0}
                                        id={`add-editor-tab-button`}
                                    >
                                        <button className={classNames(styles.addTabButton, addTabButtonDisabled ? styles.addTabButtonDisabled : null)}>
                                            <img
                                                draggable={false}
                                                src={plusIcon}
                                            />
                                        </button>
                                    </ContextMenuTrigger>
                                    
                                    <ContextMenu id={`add-editor-tab-button`}>
                                        {!tabOrder.includes('code') && <MenuItem onClick={() => addTabToEditor('code')}>
                                            <div className={styles.tabAdditionItem}>
                                                <img
                                                    draggable={false}
                                                    src={codeIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Code"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.codeTab"
                                                />
                                            </div>
                                        </MenuItem>}
                                        {!tabOrder.includes('costume') && <MenuItem onClick={() => addTabToEditor('costume')}>
                                            <div className={styles.tabAdditionItem}>
                                                <img
                                                    draggable={false}
                                                    src={costumesIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Costumes"
                                                    description="Button to get to the costumes panel"
                                                    id="gui.gui.costumesTab"
                                                />
                                            </div>
                                        </MenuItem>}
                                        {!tabOrder.includes('sound') && <MenuItem onClick={() => addTabToEditor('sound')}>
                                            <div className={styles.tabAdditionItem}>
                                                <img
                                                    draggable={false}
                                                    src={soundsIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Sounds"
                                                    description="Button to get to the sounds panel"
                                                    id="gui.gui.soundsTab"
                                                />
                                            </div>
                                        </MenuItem>}
                                        {!tabOrder.includes('variable') && <MenuItem onClick={() => addTabToEditor('variable')}>
                                            <div className={styles.tabAdditionItem}>
                                                <img
                                                    draggable={false}
                                                    src={variablesIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Variables"
                                                    description="Button to get to the variables panel"
                                                    id="pm.gui.variablesTab"
                                                />
                                            </div>
                                        </MenuItem>}
                                        {/* {!tabOrder.includes('file') && <MenuItem onClick={() => addTabToEditor('file')}>
                                            <div className={styles.tabAdditionItem}>
                                                <img
                                                    draggable={false}
                                                    src={filesIcon}
                                                />
                                                <FormattedMessage
                                                    defaultMessage="Files"
                                                    description="Button to get to the files panel"
                                                    id="pm.gui.filesTab"
                                                />
                                            </div>
                                        </MenuItem>} */}
                                    </ContextMenu>

                                    <div id="sa_addons_after_add_tab_anchor" />
                                </TabList>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            canUseCloud={canUseCloud}
                                            grow={1}
                                            isVisible={blocksTabVisible}
                                            options={{
                                                media: `${basePath}static/blocks-media/`
                                            }}
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                    </Box>
                                    <Box className={styles.extensionButtonContainer}>
                                        <button
                                            className={styles.extensionButton}
                                            title={intl.formatMessage(messages.addExtension)}
                                            onClick={onExtensionButtonClick}
                                        >
                                            <img
                                                className={styles.extensionButtonIcon}
                                                draggable={false}
                                                src={addExtensionIcon}
                                            />
                                        </button>
                                    </Box>
                                    <Box className={styles.watermark}>
                                        <Watermark />
                                    </Box>
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab
                                        vm={vm}
                                        isDark={isDark}
                                    /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {variablesTabVisible ? <VariablesTab vm={vm} /> : null}
                                </TabPanel>
                            </Tabs>
                            {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null}
                        </Box>

                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                            <StageWrapper
                                isFullScreen={isFullScreen}
                                isRendererSupported={isRendererSupported()}
                                isRtl={isRtl}
                                stageSize={stageSize}
                                vm={vm}
                            />
                            <Box className={styles.targetWrapper}>
                                <TargetPane
                                    stageSize={stageSize}
                                    vm={vm}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isDark: PropTypes.bool,
    isEmbedded: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isWindowFullScreen: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateVariablesTab: PropTypes.func,
    onActivateFilesTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickAddonSettings: PropTypes.func,
    onClickNewWindow: PropTypes.func,
    onClickTheme: PropTypes.func,
    onClickPackager: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onStartFolderUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    variablesTabVisible: PropTypes.bool,
    filesTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    usernameModalVisible: PropTypes.bool,
    settingsModalVisible: PropTypes.bool,
    customExtensionModalVisible: PropTypes.bool,
    fontsModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    canChangeLanguage: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    customStageSize: state.scratchGui.customStageSize,
    isWindowFullScreen: state.scratchGui.tw.isWindowFullScreen,
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
