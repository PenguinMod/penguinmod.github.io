import bindAll from 'lodash.bindall';
import debounce from 'lodash.debounce';
import defaultsDeep from 'lodash.defaultsdeep';
import makeToolboxXML from '../lib/make-toolbox-xml';
import PropTypes from 'prop-types';
import React from 'react';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import VMScratchBlocks from '../lib/blocks';
import VM from 'scratch-vm';

import log from '../lib/log.js';
import Prompt from './prompt.jsx';
import BlocksComponent from '../components/blocks/blocks.jsx';
import ExtensionLibrary from './extension-library.jsx';
import extensionData from '../lib/libraries/extensions/index.jsx';
import CustomProcedures from './custom-procedures.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {BLOCKS_DEFAULT_SCALE, STAGE_DISPLAY_SIZES} from '../lib/layout-constants';
import DropAreaHOC from '../lib/drop-area-hoc.jsx';
import DragConstants from '../lib/drag-constants';
import defineDynamicBlock from '../lib/define-dynamic-block';
import AddonHooks from '../addons/hooks';
import LoadScratchBlocksHOC from '../lib/tw-load-scratch-blocks-hoc.jsx';
import uid from "../lib/uid.js";

import {connect} from 'react-redux';
import {updateToolbox} from '../reducers/toolbox';
import {activateColorPicker} from '../reducers/color-picker';
import {
    closeExtensionLibrary,
    openSoundRecorder,
    openConnectionModal,
    openCustomExtensionModal
} from '../reducers/modals';
import {activateCustomProcedures, deactivateCustomProcedures} from '../reducers/custom-procedures';
import {setConnectionModalExtensionId} from '../reducers/connection-modal';
import {updateMetrics} from '../reducers/workspace-metrics';

import {
    activateTab,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

// TW: Strings we add to scratch-blocks are localized here
const messages = defineMessages({
    PROCEDURES_RETURN: {
        defaultMessage: 'return {v}',
        // eslint-disable-next-line max-len
        description: 'The name of the "return" block from the Custom Reporters extension. {v} is replaced with a slot to insert a value.',
        id: 'tw.blocks.PROCEDURES_RETURN'
    },
    PROCEDURES_TO_REPORTER: {
        defaultMessage: 'Change To Reporter',
        // eslint-disable-next-line max-len
        description: 'Context menu item to change a command-shaped custom block into a reporter. Part of the Custom Reporters extension.',
        id: 'tw.blocks.PROCEDURES_TO_REPORTER'
    },
    PROCEDURES_TO_STATEMENT: {
        defaultMessage: 'Change To Statement',
        // eslint-disable-next-line max-len
        description: 'Context menu item to change a reporter-shaped custom block into a statement/command. Part of the Custom Reporters extension.',
        id: 'tw.blocks.PROCEDURES_TO_STATEMENT'
    },
    PROCEDURES_DOCS: {
        defaultMessage: 'How to use return',
        // eslint-disable-next-line max-len
        description: 'Button in extension list to learn how to use the "return" block from the Custom Reporters extension.',
        id: 'tw.blocks.PROCEDURES_DOCS'
    }
});

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function (...args) {
        const result = oldFn.apply(this, args);
        callback.apply(this, result);
        return result;
    };
};
const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const DroppableBlocks = DropAreaHOC([
    DragConstants.BACKPACK_CODE
])(BlocksComponent);

class Blocks extends React.Component {
    constructor (props) {
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm);
        this.ScratchBlocks.Toolbox.registerMenu('extensionControls', [
            {
                text: 'Remove Extension',
                enabled: true,
                callback: ext => props.vm.extensionManager.removeExtension(ext)
            },
            {
                text: 'Remove Unused Extensions',
                enabled: true,
                callback: () => props.vm.extensionManager.removeUnusedExtensions()
            },
            {
                text: 'Replace Extension',
                enabled: true,
                callback: ext => this.props.onOpenCustomExtensionModal(ext)
            }
        ]);
        window.ScratchBlocks = this.ScratchBlocks;
        AddonHooks.blockly = this.ScratchBlocks;
        AddonHooks.blocklyCallbacks.forEach(i => i());
        AddonHooks.blocklyCallbacks.length = 0;
        bindAll(this, [
            'attachVM',
            'detachVM',
            'getToolboxXML',
            'handleCategorySelected',
            'handleConnectionModalStart',
            'handleDrop',
            'handleStatusButtonUpdate',
            'handleOpenSoundRecorder',
            'handlePromptStart',
            'handleCustomPrompt',
            'handlePromptCallback',
            'handlePromptClose',
            'handleCustomProceduresClose',
            'handleExtensionRemoved',
            'onScriptGlowOn',
            'onScriptGlowOff',
            'onBlockGlowOn',
            'onBlockGlowOff',
            'handleMonitorsUpdate',
            'handleExtensionAdded',
            'handleBlocksInfoUpdate',
            'onTargetsUpdate',
            'onVisualReport',
            'onBlockStackError',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'setBlocks',
            'setLocale',
            'handleEnableProcedureReturns'
        ]);
        this.ScratchBlocks.prompt = this.handlePromptStart;
        this.ScratchBlocks.customPrompt = this.handleCustomPrompt;
        this.ScratchBlocks.statusButtonCallback = this.handleConnectionModalStart;
        this.ScratchBlocks.recordSoundCallback = this.handleOpenSoundRecorder;

        this.state = {
            prompt: null,
            customPrompts: [],
        };
        this.onTargetsUpdate = debounce(this.onTargetsUpdate, 100);
        this.toolboxUpdateQueue = [];
        this.customModalRefs = new Map();
    }
    componentDidMount () {
        this.props.vm.setCompilerOptions({
            warpTimer: true
        });
        this.props.vm.setInEditor(false);

        this.ScratchBlocks.FieldColourSlider.activateEyedropper_ = this.props.onActivateColorPicker;
        this.ScratchBlocks.Procedures.externalProcedureDefCallback = this.props.onActivateCustomProcedures;
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);

        const Msg = this.ScratchBlocks.Msg;
        Msg.PROCEDURES_RETURN = this.props.intl.formatMessage(messages.PROCEDURES_RETURN, {
            v: '%1'
        });
        Msg.PROCEDURES_TO_REPORTER = this.props.intl.formatMessage(messages.PROCEDURES_TO_REPORTER);
        Msg.PROCEDURES_TO_STATEMENT = this.props.intl.formatMessage(messages.PROCEDURES_TO_STATEMENT);
        Msg.PROCEDURES_DOCS = this.props.intl.formatMessage(messages.PROCEDURES_DOCS);

        const workspaceConfig = defaultsDeep({},
            Blocks.defaultOptions,
            this.props.options,
            {rtl: this.props.isRtl, toolbox: this.props.toolboxXML}
        );
        this.workspace = this.ScratchBlocks.inject(this.blocks, workspaceConfig);

        // Register buttons under new callback keys for creating variables,
        // lists, and procedures from extensions.

        const toolboxWorkspace = this.workspace.getFlyout().getWorkspace();

        const varListButtonCallback = type =>
            (() => this.ScratchBlocks.Variables.createVariable(this.workspace, null, type));
        const procButtonCallback = () => {
            this.ScratchBlocks.Procedures.createProcedureDefCallback_(this.workspace);
        };

        toolboxWorkspace.registerButtonCallback('MAKE_A_VARIABLE', varListButtonCallback(''));
        toolboxWorkspace.registerButtonCallback('MAKE_A_LIST', varListButtonCallback('list'));
        toolboxWorkspace.registerButtonCallback('MAKE_A_PROCEDURE', procButtonCallback);
        toolboxWorkspace.registerButtonCallback('EXTENSION_CALLBACK', block => {
            this.props.vm.handleExtensionButtonPress(block.callbackData_);
        });
        toolboxWorkspace.registerButtonCallback('OPEN_EXTENSION_DOCS', block => {
            const docsURI = block.callbackData_;
            const url = new URL(docsURI);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                window.open(docsURI, '_blank');
            }
        });
        toolboxWorkspace.registerButtonCallback('OPEN_RETURN_DOCS', () => {
            window.open('https://docs.turbowarp.org/return', '_blank');
        });
        toolboxWorkspace.registerButtonCallback('OPEN_USERNAME_DOCS', () => {
            window.open('https://docs.penguinmod.com/username', '_blank');
        });

        // Store the xml of the toolbox that is actually rendered.
        // This is used in componentDidUpdate instead of prevProps, because
        // the xml can change while e.g. on the costumes tab.
        this._renderedToolboxXML = this.props.toolboxXML;

        // we actually never want the workspace to enable "refresh toolbox" - this basically re-renders the
        // entire toolbox every time we reset the workspace.  We call updateToolbox as a part of
        // componentDidUpdate so the toolbox will still correctly be updated
        this.setToolboxRefreshEnabled = this.workspace.setToolboxRefreshEnabled.bind(this.workspace);
        this.workspace.setToolboxRefreshEnabled = value => {
            this.setToolboxRefreshEnabled(value);
        };

        // @todo change this when blockly supports UI events
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);

        this.attachVM();
        // Only update blocks/vm locale when visible to avoid sizing issues
        // If locale changes while not visible it will get handled in didUpdate
        if (this.props.isVisible) {
            this.setLocale();
        }

        // tw: Handle when extensions are added when Blocks isn't mounted
        for (const category of this.props.vm.runtime._blockInfo) {
            this.handleExtensionAdded(category);
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        return (
            this.state.prompt !== nextState.prompt ||
            this.state.customPrompts !== nextState.customPrompts ||
            (nextState.customPrompts && this.state.customPrompts.length !== nextState.customPrompts.length) ||
            this.props.isVisible !== nextProps.isVisible ||
            this._renderedToolboxXML !== nextProps.toolboxXML ||
            this.props.extensionLibraryVisible !== nextProps.extensionLibraryVisible ||
            this.props.customProceduresVisible !== nextProps.customProceduresVisible ||
            this.props.locale !== nextProps.locale ||
            this.props.anyModalVisible !== nextProps.anyModalVisible ||
            this.props.stageSize !== nextProps.stageSize ||
            this.props.customStageSize !== nextProps.customStageSize
        );
    }
    componentDidUpdate (prevProps) {
        // If any modals are open, call hideChaff to close z-indexed field editors
        if (this.props.anyModalVisible && !prevProps.anyModalVisible) {
            this.ScratchBlocks.hideChaff();
        }

        // Only rerender the toolbox when the blocks are visible and the xml is
        // different from the previously rendered toolbox xml.
        // Do not check against prevProps.toolboxXML because that may not have been rendered.
        if (this.props.isVisible && this.props.toolboxXML !== this._renderedToolboxXML) {
            this.requestToolboxUpdate();
        }

        if (this.props.isVisible === prevProps.isVisible) {
            if (
                this.props.stageSize !== prevProps.stageSize ||
                this.props.customStageSize !== prevProps.customStageSize
            ) {
                // force workspace to redraw for the new stage size
                window.dispatchEvent(new Event('resize'));
            }
            return;
        }
        // @todo hack to resize blockly manually in case resize happened while hidden
        // @todo hack to reload the workspace due to gui bug #413
        if (this.props.isVisible) { // Scripts tab
            this.workspace.setVisible(true);
            if (prevProps.locale !== this.props.locale || this.props.locale !== this.props.vm.getLocale()) {
                // call setLocale if the locale has changed, or changed while the blocks were hidden.
                // vm.getLocale() will be out of sync if locale was changed while not visible
                this.setLocale();
            } else {
                this.props.vm.refreshWorkspace();
                this.requestToolboxUpdate();
            }

            window.dispatchEvent(new Event('resize'));
        } else {
            this.workspace.setVisible(false);
        }
    }
    componentWillUnmount () {
        this.detachVM();
        this.workspace.dispose();
        clearTimeout(this.toolboxUpdateTimeout);
        this.props.vm.setInEditor(false);
    }
    requestToolboxUpdate () {
        clearTimeout(this.toolboxUpdateTimeout);
        this.toolboxUpdateTimeout = setTimeout(() => {
            this.updateToolbox();
        }, 0);
    }
    setLocale () {
        this.ScratchBlocks.ScratchMsgs.setLocale(this.props.locale);
        this.props.vm.setLocale(this.props.locale, this.props.messages)
            .then(() => {
                this.workspace.getFlyout().setRecyclingEnabled(false);
                this.props.vm.refreshWorkspace();
                this.requestToolboxUpdate();
                this.withToolboxUpdates(() => {
                    this.workspace.getFlyout().setRecyclingEnabled(true);
                });
            });
    }

    updateToolbox () {
        this.toolboxUpdateTimeout = false;

        const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
        const offset = this.workspace.toolbox_.getCategoryScrollOffset();
        this.workspace.updateToolbox(this.props.toolboxXML);
        this._renderedToolboxXML = this.props.toolboxXML;

        // In order to catch any changes that mutate the toolbox during "normal runtime"
        // (variable changes/etc), re-enable toolbox refresh.
        // Using the setter function will rerender the entire toolbox which we just rendered.
        this.workspace.toolboxRefreshEnabled_ = true;

        const currentCategoryPos = this.workspace.toolbox_.getCategoryPositionById(categoryId);
        const currentCategoryLen = this.workspace.toolbox_.getCategoryLengthById(categoryId);
        if (offset < currentCategoryLen) {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos + offset);
        } else {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
        }

        const queue = this.toolboxUpdateQueue;
        this.toolboxUpdateQueue = [];
        queue.forEach(fn => fn());
    }

    withToolboxUpdates (fn) {
        // if there is a queued toolbox update, we need to wait
        if (this.toolboxUpdateTimeout) {
            this.toolboxUpdateQueue.push(fn);
        } else {
            fn();
        }
    }

    attachVM () {
        this.workspace.addChangeListener(this.props.vm.blockListener);
        this.flyoutWorkspace = this.workspace
            .getFlyout()
            .getWorkspace();
        this.flyoutWorkspace.addChangeListener(this.props.vm.flyoutBlockListener);
        this.flyoutWorkspace.addChangeListener(this.props.vm.monitorBlockListener);
        this.props.vm.addListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.addListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.addListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.addListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.addListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.addListener('BLOCK_STACK_ERROR', this.onBlockStackError);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.addListener('MONITORS_UPDATE', this.handleMonitorsUpdate);
        this.props.vm.addListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.addListener('EXTENSION_REMOVED', this.handleExtensionRemoved);
        this.props.vm.addListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
        this.props.vm.addListener('PERIPHERAL_CONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.addListener('PERIPHERAL_DISCONNECTED', this.handleStatusButtonUpdate);
    }
    detachVM () {
        this.props.vm.removeListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.removeListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.removeListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.removeListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.removeListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.removeListener('BLOCK_STACK_ERROR', this.onBlockStackError);
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.removeListener('MONITORS_UPDATE', this.handleMonitorsUpdate);
        this.props.vm.removeListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.removeListener('EXTENSION_REMOVED', this.handleExtensionRemoved);
        this.props.vm.removeListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.removeListener('PERIPHERAL_DISCONNECTED', this.handleStatusButtonUpdate);
    }

    updateToolboxBlockValue (id, value) {
        this.withToolboxUpdates(() => {
            const block = this.workspace
                .getFlyout()
                .getWorkspace()
                .getBlockById(id);
            if (block) {
                block.inputList[0].fieldRow[0].setValue(value);
            }
        });
    }

    onTargetsUpdate () {
        if (this.props.vm.editingTarget && this.workspace.getFlyout()) {
            ['glide', 'move', 'set'].forEach(prefix => {
                this.updateToolboxBlockValue(`${prefix}x`, Math.round(this.props.vm.editingTarget.x).toString());
                this.updateToolboxBlockValue(`${prefix}y`, Math.round(this.props.vm.editingTarget.y).toString());
            });
        }
    }
    onWorkspaceMetricsChange () {
        const target = this.props.vm.editingTarget;
        if (target && target.id) {
            // Dispatch updateMetrics later, since onWorkspaceMetricsChange may be (very indirectly)
            // called from a reducer, i.e. when you create a custom procedure.
            // TODO: Is this a vehement hack?
            setTimeout(() => {
                this.props.updateMetrics({
                    targetID: target.id,
                    scrollX: this.workspace.scrollX,
                    scrollY: this.workspace.scrollY,
                    scale: this.workspace.scale
                });
            }, 0);
        }
    }
    onScriptGlowOn (data) {
        this.workspace.glowStack(data.id, true);
    }
    onScriptGlowOff (data) {
        this.workspace.glowStack(data.id, false);
    }
    onBlockGlowOn (data) {
        this.workspace.glowBlock(data.id, true);
    }
    onBlockGlowOff (data) {
        this.workspace.glowBlock(data.id, false);
    }
    onVisualReport (data) {
        this.workspace.reportValue(data.id, data.value, false);
    }
    onBlockStackError (data) {
        // blocks still exist in fullscreen for some reason
        if (this.props.isFullScreen) return;
        if (!this.props.vm.editingTarget) return;
        const targetBlock = this.workspace.getBlockById(data.id);
        if (!targetBlock) return; // this happens when we switch sprites
        this.workspace.glowBlock(data.id, false);
        this.workspace.reportValue(data.id, data.value, true);
        this.workspace.errorStack(data.id, true);
    }
    getToolboxXML () {
        // Use try/catch because this requires digging pretty deep into the VM
        // Code inside intentionally ignores several error situations (no stage, etc.)
        // Because they would get caught by this try/catch
        try {
            let {editingTarget: target, runtime} = this.props.vm;
            const stage = runtime.getTargetForStage();
            if (!target) target = stage; // If no editingTarget, use the stage

            const stageCostumes = stage.getCostumes();
            const targetCostumes = target.getCostumes();
            const targetSounds = target.getSounds();
            const dynamicBlocksXML = this.props.vm.runtime.getBlocksXML(target);
            return makeToolboxXML(false, target.isStage, target.id, dynamicBlocksXML,
                targetCostumes[targetCostumes.length - 1].name,
                stageCostumes[stageCostumes.length - 1].name,
                targetSounds.length > 0 ? targetSounds[targetSounds.length - 1].name : '',
                this.props.isLiveTest
            );
        } catch (error) {
            return null;
        }
    }
    handleExtensionRemoved () {
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }
    }
    onWorkspaceUpdate (data) {
        // When we change sprites, update the toolbox to have the new sprite's blocks
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }

        if (this.props.vm.editingTarget && !this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id]) {
            this.onWorkspaceMetricsChange();
        }

        // Remove and reattach the workspace listener (but allow flyout events)
        this.workspace.removeChangeListener(this.props.vm.blockListener);
        const dom = this.ScratchBlocks.Xml.textToDom(data.xml);
        try {
            this.ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        } catch (error) {
            // The workspace is likely incomplete. What did update should be
            // functional.
            //
            // Instead of throwing the error, by logging it and continuing as
            // normal lets the other workspace update processes complete in the
            // gui and vm, which lets the vm run even if the workspace is
            // incomplete. Throwing the error would keep things like setting the
            // correct editing target from happening which can interfere with
            // some blocks and processes in the vm.
            if (error.message) {
                error.message = `Workspace Update Error: ${error.message}`;
            }
            log.error(error);
        }
        this.workspace.addChangeListener(this.props.vm.blockListener);

        if (this.props.vm.editingTarget && this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id]) {
            const {scrollX, scrollY, scale} = this.props.workspaceMetrics.targets[this.props.vm.editingTarget.id];
            this.workspace.scrollX = scrollX;
            this.workspace.scrollY = scrollY;
            this.workspace.scale = scale;
            this.workspace.resize();
        }

        // Clear the undo state of the workspace since this is a
        // fresh workspace and we don't want any changes made to another sprites
        // workspace to be 'undone' here.
        this.workspace.clearUndo();
    }
    handleMonitorsUpdate (monitors) {
        // Update the checkboxes of the relevant monitors.
        const flyout = this.workspace.getFlyout();
        for (const monitor of monitors.values()) {
            const blockId = monitor.get('id');
            const isVisible = monitor.get('visible');
            flyout.setCheckboxState(blockId, isVisible);
            // We also need to update the isMonitored flag for this block on the VM, since it's used to determine
            // whether the checkbox is activated or not when the checkbox is re-displayed (e.g. local variables/blocks
            // when switching between sprites).
            const block = this.props.vm.runtime.monitorBlocks.getBlock(blockId);
            if (block) {
                block.isMonitored = isVisible;
            }
        }
    }
    handleExtensionAdded (categoryInfo) {
        const defineBlocks = blockInfoArray => {
            if (blockInfoArray && blockInfoArray.length > 0) {
                const staticBlocksJson = [];
                const dynamicBlocksInfo = [];
                blockInfoArray.forEach(blockInfo => {
                    if (blockInfo.info && blockInfo.info.isDynamic) {
                        dynamicBlocksInfo.push(blockInfo);
                    } else if (blockInfo.json) {
                        staticBlocksJson.push(blockInfo.json);
                    } else if (blockInfo.info.blockType === 'button') {
                        this.workspace.registerButtonCallback(blockInfo.info.opcode, blockInfo.info.func);
                    }
                    // otherwise it's a non-block entry such as '---'
                });

                this.ScratchBlocks.defineBlocksWithJsonArray(staticBlocksJson, true);
                dynamicBlocksInfo.forEach(blockInfo => {
                    // This is creating the block factory / constructor -- NOT a specific instance of the block.
                    // The factory should only know static info about the block: the category info and the opcode.
                    // Anything else will be picked up from the XML attached to the block instance.
                    const extendedOpcode = `${categoryInfo.id}_${blockInfo.info.opcode}`;
                    const blockDefinition =
                        defineDynamicBlock(this.ScratchBlocks, categoryInfo, blockInfo, extendedOpcode);
                    this.ScratchBlocks.Blocks[extendedOpcode] = blockDefinition;
                });
            }
        };

        // scratch-blocks implements a menu or custom field as a special kind of block ("shadow" block)
        // these actually define blocks and MUST run regardless of the UI state
        defineBlocks(
            Object.getOwnPropertyNames(categoryInfo.customFieldTypes)
                .map(fieldTypeName => categoryInfo.customFieldTypes[fieldTypeName].scratchBlocksDefinition));
        defineBlocks(categoryInfo.menus);
        defineBlocks(categoryInfo.blocks);

        // Update the toolbox with new blocks if possible
        const toolboxXML = this.getToolboxXML();
        if (toolboxXML) {
            this.props.updateToolboxState(toolboxXML);
        }
    }
    handleBlocksInfoUpdate (categoryInfo) {
        // @todo Later we should replace this to avoid all the warnings from redefining blocks.
        this.handleExtensionAdded(categoryInfo);
    }
    handleCategorySelected (categoryId) {
        const extension = extensionData.find(ext => ext.extensionId === categoryId);
        if (extension && extension.launchPeripheralConnectionFlow) {
            this.handleConnectionModalStart(categoryId);
        }

        this.withToolboxUpdates(() => {
            this.workspace.toolbox_.setSelectedCategoryById(categoryId);
        });
    }
    setBlocks (blocks) {
        this.blocks = blocks;
    }
    handlePromptStart (message, defaultValue, callback, optTitle, optVarType) {
        const p = {prompt: {callback, message, defaultValue}};
        p.prompt.title = optTitle ? optTitle :
            this.ScratchBlocks.Msg.VARIABLE_MODAL_TITLE;
        p.prompt.varType = typeof optVarType === 'string' ?
            optVarType : this.ScratchBlocks.SCALAR_VARIABLE_TYPE;
        p.prompt.showVariableOptions = // This flag means that we should show variable/list options about scope
            optVarType !== this.ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE &&
            p.prompt.title !== this.ScratchBlocks.Msg.RENAME_VARIABLE_MODAL_TITLE &&
            p.prompt.title !== this.ScratchBlocks.Msg.RENAME_LIST_MODAL_TITLE;
        p.prompt.showCloudOption = (optVarType === this.ScratchBlocks.SCALAR_VARIABLE_TYPE) && this.props.canUseCloud;
        this.setState(p);
    }

    /**
     * @param {{title:string, scrollable:boolean?}} config The config for the modal
     * @param {{content:CSSStyleDeclaration?, overlay:CSSStyleDeclaration?}?} styles Sets styles on parts of the modal. If specified, at least one of the parts should have styles.
     * @param {Array<{
     *      name:string,
     *      role:"ok"|"close"|null,
     *      class:"ok"|"cancel"|null,
     *      style:CSSStyleDeclaration?,
     *      dontClose:boolean?,
     *      callback:function():void
     * }>?} buttons Buttons to place onto the modal. `role` makes the button callback run for other types of interactions.
     * @returns {Promise<HTMLElement>}
     */
    handleCustomPrompt (config, styles, buttons) {
        return new Promise((resolve, reject) => {
            /* validate arguments */
            if (config && isObject(config)) {
                if (!config.title) return reject("Custom Modal -- Missing 'title' (string) property in Param 1");
            } else {
                return reject("Custom Modal -- Param 1 must be an object with at least properties: 'title' (string)");
            }
            if (styles && !isObject(styles)) {
                return reject("Custom Modal -- Param 2 must be an object");
            }
            if (styles && (!styles.content && !styles.overlay)) {
                return reject("Custom Modal -- If Param 2 is specified, specify CSS styles within either: 'content' or 'overlay'");
            }

            // create the callback for when the node is created. an HTML element (or modal) with ref={functionHere} will run the function with the HTMLElement as 1st arg
            const thisPromptId = uid();
            this.customModalRefs.set(thisPromptId, (node) => {
                resolve(node);
            })

            // Setting state with this info will cause blocks.jsx to re-render, rendering the modal before any code after setState can run.
            // However, the callback & ref are not be usable until slightly later. this is why ref is set to a callback above.
            // This is one of many reasons why React is pretty stupid.
            this.setState({
                customPrompts: this.state.customPrompts.concat({
                    id: thisPromptId,
                    config, styles, buttons
                })
            });
        });
    }
    handleConnectionModalStart (extensionId) {
        this.props.onOpenConnectionModal(extensionId);
    }
    handleStatusButtonUpdate () {
        this.ScratchBlocks.refreshStatusButtons(this.workspace);
    }
    handleOpenSoundRecorder () {
        this.props.onOpenSoundRecorder();
    }

    /*
     * Pass along information about proposed name and variable options (scope and isCloud)
     * and additional potentially conflicting variable names from the VM
     * to the variable validation prompt callback used in scratch-blocks.
     */
    handlePromptCallback (input, variableOptions) {
        this.state.prompt.callback(
            input,
            this.props.vm.runtime.getAllVarNamesOfType(this.state.prompt.varType),
            variableOptions);
        this.handlePromptClose();
    }
    handleCustomPromptButton(button, customPrompt) {
        button.callback();
        if (button.dontClose) return;
        this.setState({
            customPrompts: this.state.customPrompts.filter(prompt => prompt !== customPrompt)
        });
    }
    handleCustomPromptOk(customPrompt) {
        const okButton = (customPrompt.buttons || []).find(button => button.role === "ok");
        if (okButton) {
            okButton.callback();
            if (okButton.dontClose) return;
            return this.setState({
                customPrompts: this.state.customPrompts.filter(prompt => prompt !== customPrompt)
            });
        }
    }
    handlePromptClose (customPrompt) {
        if (customPrompt) {
            const closeButton = (customPrompt.buttons || []).find(button => button.role === "close");
            if (closeButton) {
                closeButton.callback();
            }
            return this.setState({
                customPrompts: this.state.customPrompts.filter(prompt => prompt !== customPrompt)
            });
        }

        this.setState({prompt: null});
    }
    handleCustomProceduresClose (data) {
        this.props.onRequestCloseCustomProcedures(data);
        const ws = this.workspace;
        ws.refreshToolboxSelection_();
        ws.toolbox_.scrollToCategoryById('myBlocks');
    }
    handleDrop (dragInfo) {
        fetch(dragInfo.payload.bodyUrl)
            .then(response => response.json())
            .then(blocks => this.props.vm.shareBlocksToTarget(blocks, this.props.vm.editingTarget.id))
            .then(() => {
                this.props.vm.refreshWorkspace();
                this.updateToolbox(); // To show new variables/custom blocks
            });
    }
    handleEnableProcedureReturns () {
        this.workspace.enableProcedureReturns();
        this.requestToolboxUpdate();
    }
    render () {
        /* eslint-disable no-unused-vars */
        const {
            anyModalVisible,
            canUseCloud,
            customStageSize,
            customProceduresVisible,
            extensionLibraryVisible,
            options,
            stageSize,
            vm,
            isRtl,
            isVisible,
            onActivateColorPicker,
            onOpenConnectionModal,
            onOpenSoundRecorder,
            onOpenCustomExtensionModal,
            updateToolboxState,
            onActivateCustomProcedures,
            onRequestCloseExtensionLibrary,
            onRequestCloseCustomProcedures,
            toolboxXML,
            updateMetrics: updateMetricsProp,
            workspaceMetrics,
            ...props
        } = this.props;
        /* eslint-enable no-unused-vars */
        return (
            <React.Fragment>
                <DroppableBlocks
                    componentRef={this.setBlocks}
                    onDrop={this.handleDrop}
                    {...props}
                />
                {this.state.prompt ? (
                    <Prompt
                        defaultValue={this.state.prompt.defaultValue}
                        isStage={vm.runtime.getEditingTarget().isStage}
                        showListMessage={this.state.prompt.varType === this.ScratchBlocks.LIST_VARIABLE_TYPE}
                        label={this.state.prompt.message}
                        showCloudOption={this.state.prompt.showCloudOption}
                        showVariableOptions={this.state.prompt.showVariableOptions}
                        title={this.state.prompt.title}
                        vm={vm}
                        onCancel={this.handlePromptClose}
                        onOk={this.handlePromptCallback}
                    />
                ) : null}
                {this.state.customPrompts.map(prompt => (
                    <Prompt
                        isCustom={true}
                        vm={vm}
                        customRef={this.customModalRefs.get(prompt.id)}
                        onOk={() => this.handleCustomPromptOk(prompt)}
                        onCancel={() => this.handlePromptClose(prompt)}
                        config={prompt.config}
                        title={prompt.config.title}
                        styleContent={prompt.styles ? prompt.styles.content : null}
                        styleOverlay={prompt.styles ? prompt.styles.overlay : null}
                        customButtons={prompt.buttons}
                        onCustomButton={(button) => this.handleCustomPromptButton(button, prompt)}
                    />
                ))}
                {extensionLibraryVisible ? (
                    <ExtensionLibrary
                        vm={vm}
                        liveTest={this.props.isLiveTest}
                        onCategorySelected={this.handleCategorySelected}
                        onEnableProcedureReturns={this.handleEnableProcedureReturns}
                        onRequestClose={onRequestCloseExtensionLibrary}
                        onOpenCustomExtensionModal={this.props.onOpenCustomExtensionModal}
                    />
                ) : null}
                {customProceduresVisible ? (
                    <CustomProcedures
                        options={{
                            media: options.media
                        }}
                        onRequestClose={this.handleCustomProceduresClose}
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

Blocks.propTypes = {
    intl: intlShape,
    anyModalVisible: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    customProceduresVisible: PropTypes.bool,
    extensionLibraryVisible: PropTypes.bool,
    isRtl: PropTypes.bool,
    isVisible: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    messages: PropTypes.objectOf(PropTypes.string),
    onActivateColorPicker: PropTypes.func,
    onActivateCustomProcedures: PropTypes.func,
    onOpenConnectionModal: PropTypes.func,
    onOpenSoundRecorder: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onRequestCloseCustomProcedures: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        colours: PropTypes.shape({
            workspace: PropTypes.string,
            flyout: PropTypes.string,
            toolbox: PropTypes.string,
            toolboxSelected: PropTypes.string,
            scrollbar: PropTypes.string,
            scrollbarHover: PropTypes.string,
            insertionMarker: PropTypes.string,
            insertionMarkerOpacity: PropTypes.number,
            fieldShadow: PropTypes.string,
            dragShadowOpacity: PropTypes.number
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool
    }),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    toolboxXML: PropTypes.string,
    updateMetrics: PropTypes.func,
    updateToolboxState: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    workspaceMetrics: PropTypes.shape({
        targets: PropTypes.objectOf(PropTypes.object)
    }),
    isLiveTest: PropTypes.bool,
    isFullScreen: PropTypes.bool
};

Blocks.defaultOptions = {
    zoom: {
        controls: true,
        wheel: true,
        startScale: BLOCKS_DEFAULT_SCALE
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ddd'
    },
    colours: {
        workspace: '#F9F9F9',
        flyout: '#F9F9F9',
        toolbox: '#FFFFFF',
        toolboxSelected: '#E9EEF2',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#000000',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
    },
    comments: true,
    collapse: false,
    sounds: false
};

Blocks.defaultProps = {
    isVisible: true,
    options: Blocks.defaultOptions
};

const mapStateToProps = state => ({
    anyModalVisible: (
        Object.keys(state.scratchGui.modals).some(key => state.scratchGui.modals[key]) ||
        state.scratchGui.mode.isFullScreen
    ),
    customStageSize: state.scratchGui.customStageSize,
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    messages: state.locales.messages,
    toolboxXML: state.scratchGui.toolbox.toolboxXML,
    customProceduresVisible: state.scratchGui.customProcedures.active,
    workspaceMetrics: state.scratchGui.workspaceMetrics,
    isLiveTest: state.scratchGui.vm.isLiveTest,
    isFullScreen: state.scratchGui.mode.isFullScreen
});

const mapDispatchToProps = dispatch => ({
    onActivateColorPicker: callback => dispatch(activateColorPicker(callback)),
    onActivateCustomProcedures: (data, callback) => dispatch(activateCustomProcedures(data, callback)),
    onOpenConnectionModal: id => {
        dispatch(setConnectionModalExtensionId(id));
        dispatch(openConnectionModal());
    },
    onOpenSoundRecorder: () => {
        dispatch(activateTab(SOUNDS_TAB_INDEX));
        dispatch(openSoundRecorder());
    },
    onOpenCustomExtensionModal: swapId => dispatch(openCustomExtensionModal(swapId)),
    onRequestCloseExtensionLibrary: () => {
        dispatch(closeExtensionLibrary());
    },
    onRequestCloseCustomProcedures: data => {
        dispatch(deactivateCustomProcedures(data));
    },
    updateToolboxState: toolboxXML => {
        dispatch(updateToolbox(toolboxXML));
    },
    updateMetrics: metrics => {
        dispatch(updateMetrics(metrics));
    }
});

export default injectIntl(errorBoundaryHOC('Blocks')(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoadScratchBlocksHOC(Blocks))
));
