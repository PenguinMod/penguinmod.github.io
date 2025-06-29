// Editor Animations (remake of Reactive Animation by <https://github.com/mmmmaaaaarrrrrrkkkkkkkk>)
// By: SharkPool
// By: reflow <https://github.com/mmmmaaaaarrrrrrkkkkkkkk>

/* TODO
- patch custom modal api when added
- patch adding modals from addons (they dont use react)
*/

export default async function({ addon }) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const addonKey = "addonAnimations-";
  const cubicAnimation = "cubic-bezier(0.63, 0.32, 0.08, 0.95)";
  const getAnim = (time) => { return `${time}s ${cubicAnimation}` };

  const styles = `
/* Top Bar Items */
.${addonKey}top-bar-scaler {
    transition: transform ${getAnim(.1)};
    transform-origin: center center;
    transform-box: fill-box;
}
.${addonKey}top-bar-scaler:hover:not([addon-scale-stop="true"]) {
    transform: scale(1.05);
}
.${addonKey}top-bar-scaler:active:not([addon-scale-stop="true"]) {
    transform: scale(.95);
}

/*
  Assets, Blockly Button Texts
  Costume/Extension/Sprite/Sound Library UI
*/
.${addonKey}static-scaler {
    transition: transform ${getAnim(.1)};
    transform-origin: center center;
    transform-box: fill-box;
}
.${addonKey}static-scaler:hover:not([addon-scale-stop="true"]) {
    transform: scale(1.05);
}
.${addonKey}static-scaler:active:not([addon-scale-stop="true"]) {
    transform: scale(.95);
}

/*
  Sound & Costume Editor Buttons,
  Project Controls, Blockly Zoom
*/
.${addonKey}static-scaler-big {
    transition: transform ${getAnim(.2)} !important;
    transform-origin: center center;
    transform-box: fill-box;
}
.${addonKey}static-scaler-big:hover {
    transform: scale(1.1);
}
.${addonKey}static-scaler-big:active {
    transform: scale(.9);
}

/* Custom Extension Button (Library) */
.${addonKey}custom-ext-hover {
  transition: transform ${getAnim(.2)}, border ${getAnim(.5)};
  justify-content: center;
  border: none;
}
.${addonKey}custom-ext-hover:hover {
  border: solid 3px #00000050;
}
.${addonKey}custom-ext-hover:active {
  transform: scale(.95);
  border: none;
}

/* Library Items */
.${addonKey}library-item-scaler div[class^="library-item_library-item"] {
    transition: transform ${getAnim(.1)};
    transform-origin: center center;
    transform-box: fill-box;
}
.${addonKey}library-item-scaler div[class^="library-item_library-item"]:hover {
    transform: scale(1.05);
}
.${addonKey}library-item-scaler div[class^="library-item_library-item"]:active {
    transform: scale(.95);
}

/* Categories */
.${addonKey}category-scaler div div[class="scratchCategoryMenuRow"] {
    transition: transform ${getAnim(.1)};
    transform-origin: center center;
    transform-box: fill-box;
}
.${addonKey}category-scaler div div[class="scratchCategoryMenuRow"]:hover {
    transform: scale(1.05);
}
.${addonKey}category-scaler div div[class="scratchCategoryMenuRow"]:active {
    transform: scale(.95);
}
`;

  const styleElement = document.createElement("style");
  styleElement.classList.add("addon-editorAnimations");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
  
  let animationEnabled = !mediaQuery.matches;
  mediaQuery.addEventListener("change", (e) => {
    animationEnabled = !e.matches;
  });

  let needsInit = true, animateModals = true, animateLibraries = true, animateButtons = true;
  let patchedBody = false, sbPatched = false, sbEverPatched = false, listenerAttached = false;

  function requestAddonState() {
    animateModals = addon.settings.get("animateModals");
    animateLibraries = addon.settings.get("animateLibraries");
    animateButtons = addon.settings.get("animateButtons");
  }

  function observeMenuScalers(element, observerSub, observerAtt) {
    if (!animateModals) return;
    if (element.hasAttribute("addon-scale-listeners-bound")) return;

    const onMouseOver = () => element.setAttribute("addon-scale-stop", true);
    const onMouseOut = () => element.setAttribute("addon-scale-stop", false);

    element.addEventListener("mouseover", onMouseOver);
    element.addEventListener("mouseout", onMouseOut);
    element.setAttribute("addon-scale-listeners-bound", "true");
    element.setAttribute("addon-scale-stop", true);

    const observer = new MutationObserver(() => {
      if (
        !element.classList.contains("menu-bar_active") &&
        element.querySelector("nav")?.style?.opacity !== "1"
      ) {
        element.removeEventListener("mouseover", onMouseOver);
        element.removeEventListener("mouseout", onMouseOut);
        element.removeAttribute("addon-scale-listeners-bound");
        element.setAttribute("addon-scale-stop", false);
        observer.disconnect();
      }
    });
    observer.observe(
      element,
      { subtree: observerSub, attributes: true, attributeFilter: observerAtt }
    );
  }

  function handleOpenAnimation(elementName) {
    requestAddonState();
    const type = elementName.endsWith("Library") ? "library" : elementName.endsWith("Menu") ? "menu" : "modal";

    if (!animateLibraries && type === "library") return;
    if (!animateModals && type !== "library") return;

    let element;
    let animTime = 200;
    if (type === "menu") {
      if (elementName === "ctxMenu") element = document.querySelector(`div[class*="blocklyContextMenu"]`);
      else if (elementName === "guiCtxMenu") element = document.querySelector(`nav[class*="context-menu_context-menu"][class*="react-contextmenu--visible"]`);
      else {
        element = Array.from(document.querySelectorAll(`div[class*="menu-bar_menu-bar-menu_"] ul[class*="menu_menu_"]`));
        if (!element.length) return;
        element = element.find((e) => !e.hasAttribute("style"));
      }
      if (!element) return;

      if (type === "menu") {
        const menuItem = element.parentNode.parentNode;
        setTimeout(() => observeMenuScalers(menuItem, false, ["class"]), 10);
      }

      const ogHeight = element.getBoundingClientRect().height;
        element.style.overflow = "hidden";
        element.style.transition = `transform ${getAnim(.2)}`;
        element.style.transformOrigin = "left top";
      if (elementName === "guiCtxMenu") animTime = 500;
      else element.style.transform = "translateY(-2px) scale(.999)";

      const animation = element.animate(
        [{ height: "0px", opacity: 0 }, { height: `${ogHeight}px`, opacity: 1 }],
        { duration: animTime, easing: cubicAnimation }
      );
      animation.onfinish = () => {
        element.style.overflow = "hidden";
      };
      return;
    }

    element = document.querySelector(`div[class="ReactModalPortal"] div[class*="ReactModal__Overlay"]`)?.firstChild;
    if (!element) return;
    if (type === "library") {
      animTime = 500;
      if (elementName === "extensionLibrary" || elementName === "costumeLibrary") element.style.transformOrigin = "left bottom";
      else element.style.transformOrigin = "center bottom";
    }

    element.animate(
      [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
      { duration: animTime, easing: cubicAnimation }
    );
  }

  function attachCloseHijack(elementName) {
    requestAddonState();
    const type = elementName.endsWith("Library") ? "library" : elementName.endsWith("Menu") ? "menu" : "modal";
    if (type === "menu" || patchedBody) return;

    if (!animateLibraries && type === "library") return;
    if (!animateModals && type !== "library") return;

    // Monkey Patch
    const ogRemoveChild = document.body.constructor.prototype.removeChild;
    document.body.constructor.prototype.removeChild = function(child) {
      const element = document.querySelector(`div[class="ReactModalPortal"]`);
      if (!element) return;

      let animTime = 200;
      patchedBody = true;

      if (child === element) {
        const child = element.firstChild;
        if (child) {
          const animClone = child.cloneNode(true);
          animClone.style.position = "fixed";
          animClone.style.top = child.getBoundingClientRect().top + "px";
          animClone.style.left = child.getBoundingClientRect().left + "px";
          animClone.style.zIndex = "99999";
          animClone.style.pointerEvents = "none";
          if (type === "library") {
            animTime = 500;
            if (elementName === "extensionLibrary" || elementName === "costumeLibrary") animClone.style.transformOrigin = "left bottom";
            else animClone.style.transformOrigin = "center bottom";
          }
          document.body.appendChild(animClone);

          animClone.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: animTime, easing: cubicAnimation }
          );
          const animation = animClone.firstChild.animate(
            [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(0)", opacity: 0 }],
            { duration: animTime, easing: cubicAnimation }
          );
          animation.onfinish = () => {
            animClone.remove();
            ogRemoveChild.call(element.parentNode, element);
          };
          document.body.constructor.prototype.removeChild = ogRemoveChild;
          patchedBody = false;
          return child;
        }
      }
      return ogRemoveChild.call(this, child);
    };
  }

  function compileClasses(optLibrary) {
    requestAddonState();
    if (!animateButtons) return;
    const classMapper = new Map();

    if (optLibrary) {
      const collapser = document.querySelector(`button[class^="library_library-filter-collapse"]`);
      const filterDiv = document.querySelector(`div[class^="library_library-filter-bar"]`);
      collapser.style.transform = "rotateY(180deg)";
      collapser.addEventListener("click", (e) => {
        e.preventDefault();
        const isClosed = collapser.hasAttribute("closed");
        if (isClosed) {
          collapser.style.transform = "rotateY(180deg)";
          collapser.removeAttribute("closed");
          filterDiv.style.display = "";
          filterDiv.animate(
            [{ width: "0px", opacity: 0 }, { width: "342px", opacity: 1 }],
            { duration: 300, easing: cubicAnimation }
          );
        } else {
          collapser.style.transform = "rotateY(0deg)";
          collapser.setAttribute("closed", "true");
          const animation = filterDiv.animate(
            [{ width: "342px", opacity: 1 }, { width: "0px", opacity: 0 }],
            { duration: 300, easing: cubicAnimation }
          );
          animation.onfinish = () => { filterDiv.style.display = "none" };
        }

        e.stopPropagation();
      });

      if (optLibrary === "extensionLibrary") {
        classMapper.set("custom-ext-hover", [document.querySelector(`span[class*="button_outlined-button"][class*="tag-button_tag-button"]`)]);
      }
      classMapper.set("library-item-scaler", [document.querySelector(`div[class*="library_library-scroll-grid"]`)]);
      classMapper.set("static-scaler", [
        document.querySelector(`span[class*="modal_back-button_"]`),
        collapser
      ]);
    } else {
      classMapper.set("top-bar-scaler", document.querySelectorAll(`div[class*="menu-bar_main-menu"] div[class*="menu-bar_menu-bar-item"][class*="hoverable"]`));
      classMapper.set("category-scaler", [document.querySelector(`div[class="blocklyToolboxDiv"]`)]);
      classMapper.set("static-scaler", [
        /* Blockly Button Texts */
        ...document.querySelectorAll(`g[class="blocklyFlyoutButton"] text[class="blocklyText"]`),
        /* Costume & Sound Assets */
        ...document.querySelectorAll(`div[class*="selector_list-item"][class*="sprite-selector-item"]`),
        /* Sprite Selector */
        ...document.querySelectorAll(`div[class*="sprite-selector_sprite"][class*="sprite-selector-item"]`),
        /* Backpack Selector */
        ...document.querySelectorAll(`div[class*="backpack_backpack-item"][class*="sprite-selector-item"]`),
      ]);
      classMapper.set("static-scaler-big", [
        /* Sound & Costume Editor Buttons */
        ...document.querySelectorAll(`div[class*="sound-editor_effect-button"]`),
        ...document.querySelectorAll(`div[class*="sound-editor_tool-button"]`),
        ...document.querySelectorAll(`button[class*="sound-editor_round-button"]`),
        ...document.querySelectorAll(`span[class*="tool-select-base_mod-tool-select"]`),
        /* Project Controls */
        ...document.querySelectorAll(`div[class^="controls_controls-container"] img`),
        /* Blockly Zoom */
        ...document.querySelectorAll(`g[class="blocklyZoom"] image`),
      ]);
    }

    classMapper.forEach((elements, classN) => {
      for (const element of elements) {
        if (!element) continue;
        element.classList.add(addonKey + classN);
      }
    });
    needsInit = false;
  }

  function tryPatchScratchBlocks() {
    if (typeof ScratchBlocks !== "object") return;
    sbPatched = true;

    // some modals are from ScratchBlocks, patch them!
    queueMicrotask(() => {
      const ogSBPrompt = ScratchBlocks.prompt;
      ScratchBlocks.prompt = function(...args) {
        ogSBPrompt.call(this, ...args);

        handleOpenAnimation("modal");
        attachCloseHijack("modal");
      }

      if (sbEverPatched) return;
      sbEverPatched = true;

      const ogSBProcCreate = ScratchBlocks.Procedures.createProcedureDefCallback_
      ScratchBlocks.Procedures.createProcedureDefCallback_ = function(...args) {
        ogSBProcCreate.call(this, ...args);

        handleOpenAnimation("modal");
        attachCloseHijack("modal");
      }
      const ogSBProcEdit = ScratchBlocks.Procedures.editProcedureCallback_;
      ScratchBlocks.Procedures.editProcedureCallback_ = function(...args) {
        ogSBProcEdit.call(this, ...args);

        handleOpenAnimation("modal");
        attachCloseHijack("modal");
      }
      const ogContextMenuShow = ScratchBlocks.ContextMenu.show;
      ScratchBlocks.ContextMenu.show = function(...args) {
        ogContextMenuShow.call(this, ...args);
        handleOpenAnimation("ctxMenu");
      }

      /* this isnt a modal, but we still want to patch it for animations */
      const ogInitButton = ScratchBlocks.FlyoutButton.prototype.show;
      ScratchBlocks.FlyoutButton.prototype.show = function(...args) {
        ogInitButton.call(this, ...args);
        queueMicrotask(() => compileClasses());
      }
    });
  }

  function attachListeners() {
    const spriteRow = document.querySelector(`div[class^="sprite-selector_items-wrapper"]`);
    if (!spriteRow) return;

    document.addEventListener("contextmenu", (event) => {
      let element = event.target.closest(`div[class*="sprite-selector_sprite-wrapper"]`);
      if (element) element = element.firstChild;
      else element = event.target.closest(`div[class^="react-contextmenu-wrapper"][class*="sprite-selector-item_sprite-selector"]`);

      if (element) {
        setTimeout(() => {
          element.querySelector("nav").style.opacity = 1;
          handleOpenAnimation("guiCtxMenu");
          observeMenuScalers(element, true, ["class", "style"]);
        }, 10);
      }
    });

    listenerAttached = true;
  }

  function startListenerWorker() {
    const checkInEditor = () => !ReduxStore.getState().scratchGui.mode.isPlayerOnly;

    window.vm.on("workspaceUpdate", () => {
      queueMicrotask(() => compileClasses());
    });

    let lastModalStateID, inEditor;
    ReduxStore.subscribe(() => {
      const reduxState = ReduxStore.getState().scratchGui;
      let entries = Object.entries(reduxState.modals);
      entries.push(...Object.entries(reduxState.menus));
      const genID = [
        ...entries, ["tab", reduxState.editorTab.activeTabIndex]
      ];
      const modalStateID = genID.map(entry => entry[1]).join(".");

      const currentlyInEditor = checkInEditor();
      if (inEditor !== currentlyInEditor) {
        inEditor = currentlyInEditor;
        if (inEditor) {
          sbPatched = false;
          listenerAttached = false;
        }
      }

      if (!sbPatched) tryPatchScratchBlocks();
      if (!listenerAttached) attachListeners();

      if (!needsInit && lastModalStateID === modalStateID) return;
      lastModalStateID = modalStateID;
      queueMicrotask(() => {
        compileClasses();
        for (const entry of entries) {
          if (entry[1] === true) {
            const name = entry[0];
            handleOpenAnimation(name);
            attachCloseHijack(name);
            compileClasses(name.endsWith("Library") ? name : undefined);
            break;
          }
        }
      });
    });
  }

  if (typeof scaffolding === "undefined") startListenerWorker();
}
