import classNames from "classnames";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropTypes from "prop-types";
import React from "react";
import Box from "../box/box.jsx";
import bindAll from "lodash.bindall";

import styles from "./gui.css";
import tabStyles from "react-tabs/style/react-tabs.css";

import addExtensionIcon from "./icon--extensions.svg";
import codeIcon from "./icon--code.svg";
import costumesIcon from "./icon--costumes.svg";
import soundsIcon from "./icon--sounds.svg";
import filesIcon from "./icon--files.svg";

import Blocks from "../../containers/blocks.jsx";
import CostumeTab from "../../containers/costume-tab.jsx";
import SoundTab from "../../containers/sound-tab.jsx";
import FilesTab from "../../containers/files-tab.jsx";
import Watermark from "../../containers/watermark.jsx";

const safeJSONParse = (json, defaul, mustBeArray) => {
    try {
        const parsed = JSON.parse(json);
        if (mustBeArray && !Array.isArray(parsed)) throw "Not array";
        return parsed;
    } catch {
        return defaul;
    }
};

class OrganizedTabs extends React.Component {
    constructor(props) {
        super(props);
        // bindAll(this, [
        //     'handleMessageEvent',
        //     'wrapperEventHandler',
        //     'onUploadProject'
        // ]);
    }
    componentDidMount() {
        window.addEventListener("message", this.wrapperEventHandler);
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.wrapperEventHandler);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.stageSize !== nextProps.stageSize;
    }

    render() {
        const {
            activeTabIndex,
            onActivateTab,
            targetIsStage,
            canUseCloud,
            basePath,
            stageSize,
            vm,
            intl,
            messages,
            isDark,
            onActivateCostumesTab,
            onActivateSoundsTab,
            onExtensionButtonClick,
            blocksTabVisible,
            costumesTabVisible,
            soundsTabVisible,
        } = this.props;

        const tabClassNames = {
            tabs: styles.tabs,
            tab: classNames(tabStyles.reactTabsTab, styles.tab),
            tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
            tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
            tabPanelSelected: classNames(
                tabStyles.reactTabsTabPanelSelected,
                styles.isSelected
            ),
            tabSelected: classNames(
                tabStyles.reactTabsTabSelected,
                styles.isSelected
            ),
        };

        const organizedTabs = (() => {
            const tabOrderStr =
                localStorage.getItem("pm:taborder") ||
                '["code", "costume", "sound"]';
            const tabOrder = safeJSONParse(tabOrderStr, [], true);

            const codeTab = (
                <Tab className={tabClassNames.tab}>
                    <img draggable={false} src={codeIcon} />
                    <FormattedMessage
                        defaultMessage="Code"
                        description="Button to get to the code panel"
                        id="gui.gui.codeTab"
                    />
                </Tab>
            );
            const costumesTab = (
                <Tab
                    className={classNames(tabClassNames.tab, styles.tabCostumes)}
                    onClick={onActivateCostumesTab}
                >
                    <img draggable={false} src={costumesIcon} />
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
                </Tab>
            );
            const soundsTab = (
                <Tab
                    className={classNames(tabClassNames.tab, styles.tabSounds)}
                    onClick={onActivateSoundsTab}
                >
                    <img draggable={false} src={soundsIcon} />
                    <FormattedMessage
                        defaultMessage="Sounds"
                        description="Button to get to the sounds panel"
                        id="gui.gui.soundsTab"
                    />
                </Tab>
            );

            const tabPairs = {
                code: codeTab,
                costume: costumesTab,
                sound: soundsTab,
            };

            const enabledTabs = [];
            for (const tabId of tabOrder) {
                enabledTabs.push(tabPairs[tabId] || codeTab);
            }

            return enabledTabs;
        })();

        return (
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
                </TabList>
                <TabPanel className={tabClassNames.tabPanel}>
                    <Box className={styles.blocksWrapper}>
                        <Blocks
                            canUseCloud={canUseCloud}
                            grow={1}
                            isVisible={blocksTabVisible}
                            options={{
                                media: `${basePath}static/blocks-media/`,
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
                    {costumesTabVisible ? (
                        <CostumeTab vm={vm} isDark={isDark} />
                    ) : null}
                </TabPanel>
                <TabPanel className={tabClassNames.tabPanel}>
                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                </TabPanel>
            </Tabs>
        );
    }
}

OrganizedTabs.propTypes = {
    activeTabIndex: PropTypes.any,
    onActivateTab: PropTypes.any,
    targetIsStage: PropTypes.any,
    canUseCloud: PropTypes.any,
    basePath: PropTypes.any,
    stageSize: PropTypes.any,
    vm: PropTypes.any,
    intl: PropTypes.any,
    messages: PropTypes.any,
    isDark: PropTypes.any,
    onActivateCostumesTab: PropTypes.any,
    onActivateSoundsTab: PropTypes.any,
    onExtensionButtonClick: PropTypes.any,
    blocksTabVisible: PropTypes.any,
    costumesTabVisible: PropTypes.any,
    soundsTabVisible: PropTypes.any,
};

export default injectIntl(OrganizedTabs);
