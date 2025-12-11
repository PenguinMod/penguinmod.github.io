// TODO: access `BlockType` and `ArgumentType` without reaching into VM
// Should we move these into a new extension support module or something?
import ArgumentType from 'scratch-vm/src/extension-support/argument-type';
import BlockType from 'scratch-vm/src/extension-support/block-type';

/**
 * Define a block using extension info which has the ability to dynamically determine (and update) its layout.
 * This functionality is used for extension blocks which can change its properties based on different state
 * information. For example, the `control_stop` block changes its shape based on which menu item is selected
 * and a variable block changes its text to reflect the variable name without using an editable field.
 * @param {object} ScratchBlocks - The ScratchBlocks name space.
 * @param {object} categoryInfo - Information about this block's extension category, including any menus and icons.
 * @param {object} staticBlockInfo - The base block information before any dynamic changes.
 * @param {string} extendedOpcode - The opcode for the block (including the extension ID).
 */
// TODO: grow this until it can fully replace `_convertForScratchBlocks` in the VM runtime
const defineDynamicBlock = (ScratchBlocks, categoryInfo, staticBlockInfo, extendedOpcode) => ({
    init: function () {
        const blockJson = {
            type: extendedOpcode,
            inputsInline: true,
            category: categoryInfo.name,
            colour: categoryInfo.color1,
            colourSecondary: categoryInfo.color2,
            colourTertiary: categoryInfo.color3,
            textColour: categoryInfo.blockText,
        };
        // There is a scratch-blocks / Blockly extension called "scratch_extension" which adjusts the styling of
        // blocks to allow for an icon, a feature of Scratch extension blocks. However, Scratch "core" extension
        // blocks don't have icons and so they should not use 'scratch_extension'. Adding a scratch-blocks / Blockly
        // extension after `jsonInit` isn't fully supported (?), so we decide now whether there will be an icon.
        if (staticBlockInfo.blockIconURI || categoryInfo.blockIconURI) {
            blockJson.extensions = ['scratch_extension'];
        }
        // initialize the basics of the block, to be overridden & extended later by `domToMutation`
        this.jsonInit(blockJson);
        // initialize the cached block info used to carry block info from `domToMutation` to `mutationToDom`
        this.blockInfoText = '{}';
        // we need a block info update (through `domToMutation`) before we have a completely initialized block
        this.needsBlockInfoUpdate = true;
    },
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('blockInfo', this.blockInfoText);
        return container;
    },
    domToMutation: function (xmlElement) {
        const blockInfoText = xmlElement.getAttribute('blockInfo');
        if (!blockInfoText) return;
        if (!this.needsBlockInfoUpdate) {
            throw new Error('Attempted to update block info twice');
        }
        delete this.needsBlockInfoUpdate;
        this.blockInfoText = blockInfoText;
        const blockInfo = JSON.parse(blockInfoText);

        switch (blockInfo.blockType) {
        case BlockType.COMMAND:
        case BlockType.CONDITIONAL:
        case BlockType.LOOP:
            this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
            this.setPreviousStatement(true);
            this.setNextStatement(!blockInfo.isTerminal);
            break;
        case BlockType.REPORTER:
            this.setOutput(true);
            this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_ROUND);
            if (!blockInfo.disableMonitor) {
                this.setCheckboxInFlyout(true);
            }
            break;
        case BlockType.BOOLEAN:
            this.setOutput(true);
            this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_HEXAGONAL);
            break;
        case BlockType.HAT:
        case BlockType.EVENT:
            this.setOutputShape(ScratchBlocks.OUTPUT_SHAPE_SQUARE);
            this.setNextStatement(true);
            break;
        }

        if (blockInfo.color1 || blockInfo.color2 || blockInfo.color3) {
            // `setColour` handles undefined parameters by adjusting defined colors
            this.setColour(blockInfo.color1, blockInfo.color2, blockInfo.color3);
        }
        if (blockInfo.blockText) {
            this.setTextColour(blockInfo.blockText);
        }

        // Layout block arguments
        // TODO handle E/C Blocks
        const blockText = blockInfo.text;
        const args = {};
        let argCount = 0;
        const scratchBlocksStyleText = blockText.replace(/\[(.+?)]/g, (match, argName) => {
            const arg = blockInfo.arguments[argName];
            switch (arg.type) {
            default: // bruh
            case ArgumentType.STRING:
                args[argName] = { type: 'input_value', name: argName };
                break;
            case ArgumentType.BOOLEAN:
                args[argName] = { type: 'input_value', name: argName, check: 'Boolean' };
                break;
            }
            if (arg.menu && !categoryInfo.menuInfo[arg.menu].acceptsReporters) {
                args[argName].type = 'field_dropdown';
                args[argName].options = categoryInfo.menuInfo[arg.menu].items;
                args[argName].value = categoryInfo.menuInfo[arg.menu].items[0][1];
            }
            return `%${++argCount}`;
        });
        this.interpolate_(scratchBlocksStyleText, Object.values(args));
        if (this.isInsertionMarker()) return;
        for (const name in args) {
            if (args[name].type.startsWith('field_')) continue;
            const arg = blockInfo.arguments[name];
            const connection = this.getInput(name).connection;
            const curBlock = connection.targetConnection?.getParentBlock?.();
            if (curBlock && curBlock.type !== 'text' && !curBlock.type.startsWith('math_')) continue;
            if (arg.menu) {
                const fieldId = `${categoryInfo.id}_menu_${arg.menu}`;
                if (curBlock?.type === fieldId) continue;
                if (curBlock) curBlock.dispose();
                const newBlock = this.workspace.newBlock(fieldId);
                if (arg.defaultValue) newBlock.getField(arg.menu).setValue(arg.defaultValue);
                newBlock.setShadow(true);
                newBlock.initSvg();
                newBlock.render();
                continue;
            }
            switch (arg.type) {
            case ArgumentType.STRING: {
                if (curBlock?.type === 'text') break;
                if (curBlock) curBlock.dispose();
                const newBlock = this.workspace.newBlock('text');
                connection.connect(newBlock.outputConnection);
                newBlock.getField('TEXT').setValue(arg.defaultValue ?? '');
                newBlock.setShadow(true);
                newBlock.initSvg();
                newBlock.render();
                break;
            }
            case ArgumentType.NUMBER: {
                if (curBlock && !curBlock.type.startsWith('math_')) break;
                if (curBlock) curBlock.dispose();
                const newBlock = this.workspace.newBlock('math_number');
                connection.connect(newBlock.outputConnection);
                newBlock.getField('NUM').setValue(arg.defaultValue ?? '');
                newBlock.setShadow(true);
                newBlock.initSvg();
                newBlock.render();
                break;
            }
            case ArgumentType.BOOLEAN: {
                if (!curBlock) break;
                curBlock.dispose();
                break;
            }
            }
        }
    }
});

export default defineDynamicBlock;
