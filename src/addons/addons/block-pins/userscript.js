// Block Pinning
// By: SharkPool

export default async function({ addon }) {
  const Blockly = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;

  const categoryIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MC42OTIiIGhlaWdodD0iNzAuNjkyIiB2aWV3Qm94PSIwIDAgNzAuNjkyIDcwLjY5MiI+PHBhdGggZD0iTTAgMzUuMzQ2QzAgMTUuODI1IDE1LjgyNSAwIDM1LjM0NiAwczM1LjM0NiAxNS44MjUgMzUuMzQ2IDM1LjM0Ni0xNS44MjUgMzUuMzQ2LTM1LjM0NiAzNS4zNDZTMCA1NC44NjcgMCAzNS4zNDYiIGZpbGw9IiNjNWJmOTYiLz48cGF0aCBkPSJNNC42NTYgMzUuMzQ2YzAtMTYuOTUgMTMuNzQtMzAuNjkgMzAuNjktMzAuNjlzMzAuNjkgMTMuNzQgMzAuNjkgMzAuNjktMTMuNzQgMzAuNjktMzAuNjkgMzAuNjktMzAuNjktMTMuNzQtMzAuNjktMzAuNjkiIGZpbGw9IiNmZmY3YzIiLz48cGF0aCBkPSJNNDguOTU2IDQ0LjAwMyA1MSA1MC4wMmwtNi4wMTctMi4wNDVMMzQuMTY4IDM3LjE2Yy0xLjg3MyAxLjY1NS02LjAwNyA1LjE1MS03LjMwMyA1LjAxOS0yLjM4Ny0uMjQ0LTEuODg5LTIuOTQ3LTIuMDQ4LTUuMzc2LS4xNTgtMi40MyAxLjQ3MS0zLjQ0IDEuNDcxLTMuNDRsLTUuODc5LTUuODhhMi40NSAyLjQ1IDAgMCAxIDAtMy40NjFsNC42MzMtNC42MzNhMi40NSAyLjQ1IDAgMCAxIDMuNDYxIDBsNi4wNyA2LjA3czIuMTQ5LTIuMDAzIDMuOTAyLTJjMS43NTMuMDAyIDUuNjY0LjA3NSA1LjMyMyAyLjAxMy0uMjM1IDEuMzMyLTQuMTExIDUuOTYtNS42MzkgNy43MzV6IiBmaWxsPSIjNDQ1MjczIi8+PC9zdmc+";

  const category = document.createElementNS("http://www.w3.org/1999/xml", "category");
  category.setAttribute("name", "Pinned");
  category.setAttribute("id", "pinned");
  category.setAttribute("colour", "#ffffff");
  category.setAttribute("secondaryColour", "#ffffff");
  category.setAttribute("iconURI", categoryIcon);

  const gap = document.createElementNS("http://www.w3.org/1999/xml", "sep");
  gap.setAttribute("gap", "36");

  let populateInit = false;
  let pins = loadPins();

  const autoLoadExtPins = addon.settings.get("autoLoadExts");

  function findExtensionPins() {
    const extUrls = [];

    const manager = vm.extensionManager;
    const loadedExts = manager._loadedExtensions;
    loadedExts.keys().forEach((id) => {
      if (pins.some(b => b.startsWith(id))) {
        const meta = loadedExts.get(id);

        if (meta.startsWith("extension_")) {
          // built-in extension
          extUrls.push(id);
        } else {
          // external extension
          const index = parseInt(meta.split(".")[1]);
          extUrls.push(manager.workerURLs[index]);
        }
      }
    });
    return extUrls;
  }

  function loadPins() {
    try {
      const item = localStorage.getItem("ADDONS_BLOCK-PINS");
      if (!item) return;

      const testPins = JSON.parse(item);
      if (Array.isArray(testPins.blocks) && Array.isArray(testPins.exts)) {
        // load required extensions
        const manager = vm.extensionManager;
        for (const ext of testPins.exts) {
          try {
            const isURL = new URL(ext);
            manager.loadExtensionURL(ext);
          } catch {
            // not a URL, must be a built-in
            manager.loadExtensionIdSync(ext);
          }
        }
        return testPins.blocks;
      } else {
        return [];
      }
    } catch {
      console.warn("Malformed Block Pins!");
      localStorage.removeItem("ADDONS_BLOCK-PINS");
      return [];
    }
  }

  function storePins() {
    const requiredExtensions = autoLoadExtPins ? findExtensionPins() : [];
    localStorage.setItem(
      "ADDONS_BLOCK-PINS", JSON.stringify({
        blocks: pins, exts: requiredExtensions
      })
    );
  }

  const createMenuItem = (text, enabled, callback) => {
    // so amazing, saves like, 20 lines
    return { text, enabled, callback };
  };

  const createLabel = (text) => {
    const label = document.createElementNS("http://www.w3.org/1999/xml", "label");
    label.setAttribute("text", text);
    return label;
  };

  const populateCategory = () => {
    category.innerHTML = ""; // flush out blocks

    if (pins.length) {
      const flyoutWS = Blockly.mainWorkspace.getFlyout().workspace_;
      const blocksXML = [];
      for (const id of pins) {
        const block = flyoutWS.getBlockById(id);
        if (block) blocksXML.push(Blockly.Xml.blockToDom(block));
        // TODO fix pinned sprite-variables being weird in other sprites
      }
      category.append(...blocksXML, gap);
    } else {
      category.append(createLabel("No Pinned Blocks!"), gap);
    }
  }

  const updatePinCategory = () => {
    populateCategory();
    const toolbox = Blockly.mainWorkspace.getToolbox();
    toolbox.populate_(toolbox.workspace_.options.languageTree);

    storePins();
  };

  const toggleBlockPin = (id, isPinning, forceOrder) => {
    const oldLength = pins.length;
    const index = pins.indexOf(id);
    if (isPinning) {
      switch (forceOrder) {
        case "top":
          pins.splice(index, 1);
          pins = [id, ...pins];
          break;
        case "bottom":
          pins.splice(index, 1);
          pins.push(id);
          break;
        case "category": {
          const toolbox = Blockly.mainWorkspace.getToolbox();
          const flyoutWS = Blockly.mainWorkspace.getFlyout().workspace_;
          const categories = toolbox.categoryMenu_.categories_.map(c => c.id_);

          const getCategoryInd = (id) => {
            const block = flyoutWS.getBlockById(id);
            let cateID = block.category_;
            if (cateID === "data") cateID = "variables";
            else if (cateID === "data-lists") cateID = "lists";
            else if (cateID === null) cateID = "myBlocks";
            return categories.indexOf(cateID);
          };

          pins = pins.sort((a, b) => getCategoryInd(a) - getCategoryInd(b));
          break;
        }
        default:
          pins.push(id);
      }
    } else if (index > -1) {
      pins.splice(index, 1);
    }

    if (oldLength !== pins.length || forceOrder) updatePinCategory();
  };

  Blockly.BlockSvg.prototype.showContextMenu_ = function(e) {
    if (this.workspace.options.readOnly || !this.contextMenu) {
      return;
    }

    let shouldPatchClasses = false;

    // Save the current block in a variable for use in closures.
    var block = this;
    var menuOptions = [];
    if (this.isDeletable() && this.isMovable()) {
      if (block.isInFlyout) {
        const blockID = block.id;
        if (pins.includes(blockID)) {
          shouldPatchClasses = true;
          menuOptions.push(
            createMenuItem("Move to Top", true, () => toggleBlockPin(blockID, true, "top")),
            createMenuItem("Move to Bottom", true, () => toggleBlockPin(blockID, true, "bottom")),
            createMenuItem("Organize by Category", true, () => toggleBlockPin("", true, "category")),
            createMenuItem("Unpin", true, () => toggleBlockPin(block.id, false))
          );
        } else {
          menuOptions.push(
            createMenuItem("Pin", true, () => toggleBlockPin(blockID, true)),
            createMenuItem("Unpin", false, () => {})
          );
        }

        menuOptions.push(createMenuItem("Unpin All", pins.length, () => {
          pins = [];
          updatePinCategory();
        }));
      } else {
        menuOptions.push(Blockly.ContextMenu.blockDuplicateOption(block, e));
        if (this.isEditable() && this.workspace.options.comments) {
          menuOptions.push(Blockly.ContextMenu.blockCommentOption(block));
        }
        menuOptions.push(Blockly.ContextMenu.blockDeleteOption(block));
      }
    } else if (this.parentBlock_ && this.isShadow_ && this.type !== 'polygon') {
      this.parentBlock_.showContextMenu_(e);
      return;
    }

    // Allow the block to add or modify menuOptions.
    if (this.customContextMenu) {
      this.customContextMenu(menuOptions);
    }
    Blockly.ContextMenu.show(e, menuOptions, this.RTL);
    Blockly.ContextMenu.currentBlock = this;

    if (shouldPatchClasses) {
      // since we have to patch the context meny generator, we cant use
      // addon apis to fancify the menu. So, recreate it here:
      const menuItems = Blockly.WidgetDiv.DIV.querySelectorAll(`div[class^="goog-menuitem-content"]`);
      /* Unpin item */
      menuItems[3].parentNode.style.borderTop = "1px solid rgba(0, 0, 0, 0.15)";
    };
  }

  const ogPopulate = Blockly.Toolbox.CategoryMenu.prototype.populate;
  Blockly.Toolbox.CategoryMenu.prototype.populate = function(newTree) {
    if (!populateInit) {
      populateInit = true;
      setTimeout(() => {
        // 1 second is a good buffer
        populateCategory();
        const toolbox = Blockly.mainWorkspace.getToolbox();
        toolbox.populate_(toolbox.workspace_.options.languageTree);
      }, 1000);
    }

    newTree.insertBefore(category, newTree.firstElementChild);
    ogPopulate.call(this, newTree);
  }

  addon.self.addEventListener("disabled", () => {
    localStorage.removeItem("ADDONS_BLOCK-PINS");
  });
}
