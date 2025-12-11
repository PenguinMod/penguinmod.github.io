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

  let populateInit = 0; // counts up to 3, any 'populate' call while this is less than 3 will update the toolbox
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
      if (!item) return [];

      const testPins = JSON.parse(item);
      if (Array.isArray(testPins.blocks) && Array.isArray(testPins.exts)) {
        // load required extensions
        const manager = vm.extensionManager;
        for (const ext of testPins.exts) {
          try {
            const isURL = new URL(ext);
            manager.securityManager.canLoadExtensionFromProject(ext).then(isUnsandbox => {
              manager.loadExtensionURL(ext);
            });
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

  const specifyType = (block) => {
    let type = block.type;
    if (type === "data_variable" || type === "data_listcontents") {
      type += "||v||" + block.getVars()[0];
    } else if (type === "procedures_call") {
      type += "||p||" + block.getProcCode();
    }
    return type;
  };

  const getBlockByType = (type, ws) => {
    const typeMeta = type.split("||");
    const blocks = Object.values(ws.blockDB_);
    if (typeMeta.length === 1) return blocks.find(b => b.type === type);
    else {
      const candidates = blocks.filter(b => b.type === typeMeta[0]);
      for (const test of candidates) {
        if (typeMeta[1] === "p") {
          if (test.getProcCode() === typeMeta[2]) return test;
        }
        if (typeMeta[1] === "v") {
          if (test.getVars()[0] === typeMeta[2]) return test;
        }
      }
      return null;
    }
  };

  const populateCategory = () => {
    category.innerHTML = ""; // flush out blocks

    if (pins.length) {
      const flyoutWS = Blockly.mainWorkspace.getFlyout().workspace_;
      const blocksXML = [];
      let successes = 0;
      for (const type of pins) {
        const block = getBlockByType(type, flyoutWS);
        if (block) {
          successes++;
          blocksXML.push(Blockly.Xml.blockToDom(block));
        } else {
          console.warn("Pins Addon -- Could not find block with type: " + type);
        }
      }

      if (blocksXML.length === 0) blocksXML.push(createLabel("No Pinned Blocks!"));
      else if (successes !== pins.length) blocksXML.push(createLabel("Some Pins Could Not Load!"));
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

  const toggleBlockPin = (block, isPinning, forceOrder) => {
    const oldLength = pins.length;
    const type = specifyType(block);
    const index = pins.indexOf(type);

    if (isPinning) {
      switch (forceOrder) {
        case "top":
          pins.splice(index, 1);
          pins = [type, ...pins];
          break;
        case "bottom":
          pins.splice(index, 1);
          pins.push(type);
          break;
        case "category": {
          const toolbox = Blockly.mainWorkspace.getToolbox();
          const flyoutWS = Blockly.mainWorkspace.getFlyout().workspace_;
          const categories = toolbox.categoryMenu_.categories_.map(c => c.id_);

          const getCategoryInd = (id) => {
            const block = getBlockByType(id, flyoutWS);
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
          if (index === -1) pins.push(type);
      }
    } else if (index > -1) {
      pins.splice(index, 1);
    }

    if (oldLength !== pins.length || forceOrder) updatePinCategory();
  };

  const ogShowCtxMenu = Blockly.BlockSvg.prototype.showContextMenu_;
  Blockly.BlockSvg.prototype.showContextMenu_ = function(e) {
    if (this.workspace.options.readOnly || !this.contextMenu) return;

    let shouldPatchClasses = false;

    // Save the current block in a variable for use in closures.
    var block = this;
    var menuOptions = [];
    if (this.isDeletable() && this.isMovable() && block.isInFlyout) {
      if (pins.includes(specifyType(block))) {
        shouldPatchClasses = true;
        menuOptions.push(
          createMenuItem("Move to Top", true, () => toggleBlockPin(block, true, "top")),
          createMenuItem("Move to Bottom", true, () => toggleBlockPin(block, true, "bottom")),
          createMenuItem("Organize by Category", true, () => toggleBlockPin("", true, "category")),
          createMenuItem("Pin", false, () => {}),
          createMenuItem("Unpin", true, () => toggleBlockPin(block, false))
        );
      } else {
        menuOptions.push(
          createMenuItem("Pin", true, () => toggleBlockPin(block, true)),
          createMenuItem("Unpin", false, () => {})
        );
      }

      menuOptions.push(createMenuItem("Unpin All", pins.length, () => {
        pins = [];
        updatePinCategory();
      }));
    } else {
      ogShowCtxMenu.call(this, e);
      return;
    }

    if (this.customContextMenu) this.customContextMenu(menuOptions);
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
    if (populateInit < 3) {
      populateInit++;
      setTimeout(() => {
        // 1 second is a good buffer
        populateCategory();
        const toolbox = Blockly.mainWorkspace.getToolbox();
        if (!toolbox) return;
        toolbox.populate_(toolbox.workspace_.options.languageTree);
      }, 1000);
    }

    newTree.insertBefore(category, newTree.firstElementChild);
    ogPopulate.call(this, newTree);
  }

  vm.runtime.on("PROJECT_LOADED", () => {
    populateInit = 0;
  });
  if (!autoLoadExtPins) vm.runtime.on("EXTENSION_ADDED", () => {
    populateInit = 2;
  });
  vm.runtime.on("EXTENSION_REMOVED", (extId) => {
    // remove blocks in the removed extension from pins
    pins = pins.filter((t) => !t.startsWith(extId));

    populateInit = 2;
  });
  addon.self.addEventListener("disabled", () => {
    localStorage.removeItem("ADDONS_BLOCK-PINS");
  });
}
