// Editor Tweaks
// By: SharkPool

export default async function({ addon }) {
  const Blockly = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;

  // addon settings
  let oldCkbxEnabled = true, oldToolboxScrolls = true, oldBlocksGlow = true, oldExpandBtnSz = 1;
  let ckbxEnabled = true, toolboxScrolls = true, blocksGlow = true, expandBtnSz = 1;
  let workspaceRefreshCache = 0;

  // patch variables and functions
  const ogWS2Dom = Blockly.Xml.workspaceToDom;
  const ogMutatorBuilder = Blockly.scratchBlocksUtils.generateMutatorShadow;
  const ogSetShadowDom = ScratchBlocks.RenderedConnection.prototype.setShadowDom;
  const ogStartScrollAnim = Blockly.Flyout.prototype.startScrollAnimation;
  const ogGlowFuncs = {
    run: Blockly.BlockSvg.prototype.setGlowStack,
    error: Blockly.BlockSvg.prototype.setErrorStack,
    replace1: Blockly.BlockSvg.prototype.highlightForReplacement,
    replace2: Blockly.BlockSvg.prototype.highlightShapeForInput
  };

  const fixedWorkspace2Dom = function(...args) {
    const dom = ogWS2Dom.call(this, ...args);
    if (!args[0].isFlyout) return dom;

    // we only want to edit the flyout
    const domArray = Array.from(dom.children);
    for (const item of domArray) {
      if (item.localName !== "block") continue;

      for (const input of Array.from(item.children)) {
        // clear checkboxes
        if (input.localName !== "value") continue;
        const shadow = input.firstChild;
        if (shadow.getAttribute("type") === "checkbox") shadow.remove();
      }
    }
    return dom;
  }

  const fixedSetShadowDom = function(...args) {
    // prevent checkboxes from respawning
    if (this.sourceBlock_.isInFlyout) {
      if (args[0] && args[0].getAttribute("type") === "checkbox") {
        this.shadowDom_ = null;
        queueMicrotask(() => {
          const shadowBlock = this.targetBlock();
          if (shadowBlock) shadowBlock.dispose();
        });
        return;
      }
    }
    return ogSetShadowDom.call(this, ...args);
  };

  // internals
  function updateAllBlocks(flyoutOnly) {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      if (!flyoutOnly && vm.editingTarget) vm.emitWorkspaceUpdate();
      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
        workspace.getToolbox().refreshSelection();
        workspace.toolboxRefreshEnabled_ = true;
      }
    }
  }

  function requestAddonState() {
    ckbxEnabled = addon.settings.get("checkboxesEnabled");
    toolboxScrolls = addon.settings.get("toolboxScrolling");
    blocksGlow = addon.settings.get("blocksGlow");
    expandBtnSz = addon.settings.get("expandableButtonSize") / 100;
    Blockly.Procedures.ADDON_SP_CHECKBOXES_DISABLED = !ckbxEnabled;
  }

  function applyChanges() {
    requestAddonState();
    toggleCheckboxes();
    toggleToolBoxScroll();
    toggleBlockGlow();
    setExpandableSize();
    if (workspaceRefreshCache > 0) updateAllBlocks(2 > workspaceRefreshCache);
    workspaceRefreshCache = 0;
  }

  function toggleCheckboxes() {
    if (oldCkbxEnabled === ckbxEnabled) return;
    oldCkbxEnabled = ckbxEnabled;
    workspaceRefreshCache++;

    Blockly.Xml.workspaceToDom = ckbxEnabled ? ogWS2Dom : fixedWorkspace2Dom;
    Blockly.RenderedConnection.prototype.setShadowDom = ckbxEnabled ? ogSetShadowDom : fixedSetShadowDom;

    Blockly.scratchBlocksUtils.generateMutatorShadow = ckbxEnabled ? ogMutatorBuilder : function(...args) {
      if (args[1] === "checkbox") return;
      ogCheckboxBlockInit.call(this, ...args);
    };

    Blockly.Blocks["control_expandableIf"].fillInBlock = Blockly.scratchBlocksUtils.generateMutatorShadow;
    Blockly.Blocks["operator_expandableBool"].fillInBlock = Blockly.scratchBlocksUtils.generateMutatorShadow;
  }

  function toggleToolBoxScroll() {
    if (oldToolboxScrolls === toolboxScrolls) return;
    oldToolboxScrolls = toolboxScrolls;

    Blockly.Flyout.prototype.startScrollAnimation = toolboxScrolls ? ogStartScrollAnim : function() {
      this.scrollTime = -1;
      this.scrollStart = this.scrollTarget;
      this.stepScrollAnimation(performance.now());
    };
  }

  function toggleBlockGlow() {
    if (oldBlocksGlow === blocksGlow) return;
    oldBlocksGlow = blocksGlow;
    if (blocksGlow) return;

    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
        console.warn("Editor Tweaks: Error -- Could not remove glow from workspace");
        oldBlocksGlow = undefined;
        return;
    }

    // these are shared across workspaces, remove to save RAM
    workspace.options.stackGlowBlur.parentNode.remove();
    workspace.options.stackGlowBlurError.parentNode.remove();
    workspace.options.stackReplaceGlow.remove();

    const applyToOuterStack = (topBlock, func) => {
        func(topBlock);
        let nextBlock = topBlock.getNextBlock();
        while (nextBlock !== null) {
            func(nextBlock);
            nextBlock = nextBlock.getNextBlock();
        }
    };

    // patch glow functions to not... glow. Instead give a lighter indicator
    const BlockSvgProto = Blockly.BlockSvg.prototype;
    BlockSvgProto.setGlowStack = blocksGlow ? ogGlowFuncs.run : function(isGlowingStack) {
      this.isGlowingStack_ = isGlowingStack;
      this.getSvgRoot().removeAttribute("filter"); //remove old glow

      if (isGlowingStack) applyToOuterStack(this, (block) => {
        block.svgPath_.classList.remove("blocklyPath");
        block.svgPath_.setAttribute("stroke", "#fff200");
        block.svgPath_.setAttribute("stroke-width", "5");
      });
      else applyToOuterStack(this, (block) => {
        block.svgPath_.classList.add("blocklyPath");
        block.svgPath_.setAttribute("stroke", block.colourTertiary_);
        block.svgPath_.removeAttribute("stroke-width");
      });
    };
    BlockSvgProto.setErrorStack = blocksGlow ? ogGlowFuncs.error : function(isGlowingStack) {
      this.isGlowingStack_ = isGlowingStack;
      this.getSvgRoot().removeAttribute("filter"); //remove old glow

      if (isGlowingStack) applyToOuterStack(this, (block) => {
        block.svgPath_.classList.remove("blocklyPath");
        block.svgPath_.setAttribute("stroke", "#ff0000");
        block.svgPath_.setAttribute("stroke-width", "5");
      });
      else applyToOuterStack(this, (block) => {
        block.svgPath_.classList.add("blocklyPath");
        block.svgPath_.setAttribute("stroke", block.colourTertiary_);
        block.svgPath_.removeAttribute("stroke-width");
      });
    };

    BlockSvgProto.highlightForReplacement = blocksGlow ? ogGlowFuncs.replace1 : function(adding) {
      this.getSvgRoot().removeAttribute("filter"); //remove old glow
      if (adding) {
        this.svgPath_.classList.remove("blocklyPath");
        this.svgPath_.setAttribute("stroke", "#fff");
        this.svgPath_.setAttribute("stroke-width", "6");
      } else {
        this.svgPath_.classList.add("blocklyPath");
        this.svgPath_.setAttribute("stroke", this.colourTertiary_);
        this.svgPath_.removeAttribute("stroke-width");
      }
    };
    BlockSvgProto.highlightShapeForInput = blocksGlow ? ogGlowFuncs.replace2 : function(connection, adding) {
      const input = this.getInputWithConnection(connection);
      if (!input) throw 'No input found for the connection';
      if (!input.outlinePath) return;

      input.outlinePath.removeAttribute("filter"); //remove old glow
      if (adding) {
        input.outlinePath.classList.remove("blocklyPath");
        input.outlinePath.setAttribute("stroke", "#fff");
        input.outlinePath.setAttribute("stroke-width", "5");
      } else {
        input.outlinePath.classList.add("blocklyPath");
        input.outlinePath.setAttribute("stroke", this.colourTertiary_);
        input.outlinePath.removeAttribute("stroke-width");
      }
    };
  }

  function setExpandableSize() {
    if (oldExpandBtnSz === expandBtnSz) return;
    oldExpandBtnSz = expandBtnSz;
    workspaceRefreshCache = 2;

    // override these, ripped from the Blocks Repo with minor changes
    const addImg = Blockly.FieldExpandableAdd.prototype.BTN_IMG;
    Blockly.FieldExpandableAdd.prototype.init = function() {
      if (this.fieldGroup_) return;
      Blockly.FieldExpandableAdd.superClass_.init.call(this);

      if (expandBtnSz === 0 && this.sourceBlock_) {
        const input = this.sourceBlock_.inputList.find(i => i.fieldRow.includes(this));
        if (input) {
            // we dont want to hide labels or other fields:
            if (input.fieldRow.length > 2) {
                for (const field of input.fieldRow) {
                  if (
                    field instanceof Blockly.FieldExpandableAdd ||
                    field instanceof Blockly.FieldExpandableRemove
                  ) field.setVisible(false);
                }
            } else { 
              input.setVisible(false);
            }
        }
      }

      const ratio = (Blockly.BlockSvg.FIELD_HEIGHT / 32) * expandBtnSz;
      this.size_.width = Blockly.BlockSvg.FIELD_HEIGHT * expandBtnSz;
      this.size_.height *= expandBtnSz;
      this.overrideSep = 1;
      this.boxGroup_ = Blockly.utils.createSvgElement('g', {}, null);
      this.box_ = Blockly.utils.createSvgElement('rect', {
          'x': 0,'y': 0, 'rx': 4, 'ry': 4,
          'width': this.size_.width, 'height': this.size_.height,
          'fill': "#00000000", 'stroke': "#00000035", 'cursor': this.CURSOR
        },
        this.boxGroup_
      );
      this.icon_ = Blockly.utils.createSvgElement('image', {
          'x': 5 * ratio, 'y': 5 * ratio,
          'width': this.size_.width / 1.5, 'height': this.size_.height / 1.5,
          'xlink:href': addImg, 'href': addImg,
        },
        this.boxGroup_
      );
      this.fieldGroup_.insertBefore(this.boxGroup_, this.textElement_);
    };

    const removeImg = Blockly.FieldExpandableRemove.prototype.BTN_IMG;
    Blockly.FieldExpandableRemove.prototype.init = function() {
      if (this.fieldGroup_) return;
      Blockly.FieldExpandableRemove.superClass_.init.call(this);

      const ratio = (Blockly.BlockSvg.FIELD_HEIGHT / 32) * expandBtnSz;
      this.size_.width = Blockly.BlockSvg.FIELD_HEIGHT * expandBtnSz;
      this.size_.height *= expandBtnSz;
      this.overrideSep = 1;
      this.boxGroup_ = Blockly.utils.createSvgElement('g', {}, null);
      this.box_ = Blockly.utils.createSvgElement('rect', {
          'x': 0, 'y': 0, 'rx': 4, 'ry': 4,
          'width': this.size_.width, 'height': this.size_.height,
          'fill': "#00000000", 'stroke': "#00000035", 'cursor': this.CURSOR
        },
        this.boxGroup_
      );
      this.icon_ = Blockly.utils.createSvgElement('image', {
          'x': 5 * ratio, 'y': 5 * ratio,
          'width': this.size_.width / 1.5, 'height': this.size_.height / 1.5,
          'xlink:href': removeImg, 'href': removeImg,
        },
        this.boxGroup_
      );
      this.fieldGroup_.insertBefore(this.boxGroup_, this.textElement_);
    };

    // fix block chin height
    Blockly.Blocks['control_expandableIf'].fixupButtons = function() {
      const expandableInput = this.getInput("");
      this.inputList.splice(this.inputList.indexOf(expandableInput), 1);
      this.inputList.push(expandableInput);

      expandableInput.setAlign(1);
      const hiddenBtn = expandableInput.fieldRow[0];
      hiddenBtn.size_.width = 0.5;
      hiddenBtn.size_.height = (Blockly.BlockSvg.INPUT_SHAPE_HEIGHT + 16) * expandBtnSz;
      hiddenBtn.setVisible(false);
    }
  }

  addon.self.addEventListener("reenabled", applyChanges);
  addon.settings.addEventListener("change", applyChanges);
  addon.self.addEventListener("disabled", () => {
    ckbxEnabled = true,
    expandBtnSz = 1;
    applyChanges();
  });

  applyChanges();
}
