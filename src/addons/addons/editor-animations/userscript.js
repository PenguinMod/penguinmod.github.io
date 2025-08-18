// Editor Animations (remake of Reactive Animation by <https://github.com/mmmmaaaaarrrrrrkkkkkkkk>)
// By: SharkPool
// By: reflow <https://github.com/mgikdev>

export default async function({ addon }) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const addonKey = "addonAnimations-";
  const animationTypes = {
    "default": "cubic-bezier(0.63, 0.32, 0.08, 0.95)",
    "easeIn": "cubic-bezier(0.42, 0, 1.0, 1.0)",
    "easeOut": "cubic-bezier(0, 0, 0.58, 1.0)",
    "easeInOut": "cubic-bezier(0.42, 0, 0.58, 1.0)",
    "smoothStep": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    "fastInSlowOut": "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
    "sineIn": "cubic-bezier(0.47, 0, 0.745, 0.715)",
    "sineOut": "cubic-bezier(0.39, 0.575, 0.565, 1)",
    "sineInOut": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
    "quadIn": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
    "quadOut": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "quadInOut": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
    "cubicIn": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    "cubicOut": "cubic-bezier(0.215, 0.61, 0.355, 1)",
    "cubicInOut": "cubic-bezier(0.645, 0.045, 0.355, 1)",
    "quartIn": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
    "quartOut": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "quartInOut": "cubic-bezier(0.77, 0, 0.175, 1)",
    "quintIn": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    "quintOut": "cubic-bezier(0.23, 1, 0.32, 1)",
    "quintInOut": "cubic-bezier(0.86, 0, 0.07, 1)",
    "backIn": "cubic-bezier(0.6, -0.28, 0.74, 0.05)",
    "backOut": "cubic-bezier(0.18, 0.89, 0.32, 1.28)",
    "backInOut": "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    "elastic": "linear(0 0%, 0.22 2.1%, 0.86 6.5%, 1.11 8.6%, 1.3 10.7%, 1.35 11.8%, 1.37 12.9%, 1.37 13.7%, 1.36 14.5%, 1.32 16.2%, 1.03 21.8%, 0.94 24%, 0.89 25.9%, 0.88 26.85%, 0.87 27.8%, 0.87 29.25%, 0.88 30.7%, 0.91 32.4%, 0.98 36.4%, 1.01 38.3%, 1.04 40.5%, 1.05 42.7%, 1.05 44.1%, 1.04 45.7%, 1 53.3%, 0.99 55.4%, 0.98 57.5%, 0.99 60.7%, 1 68.1%, 1.01 72.2%, 1 86.7%, 1 100%)",
    "bounce": "linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%)",
    "emphasis": "linear(0 0%, 0 1.8%, 0.01 3.6%, 0.03 6.35%, 0.07 9.1%, 0.13 11.4%, 0.19 13.4%, 0.27 15%, 0.34 16.1%, 0.54 18.35%, 0.66 20.6%, 0.72 22.4%, 0.77 24.6%, 0.81 27.3%, 0.85 30.4%, 0.88 35.1%, 0.92 40.6%, 0.94 47.2%, 0.96 55%, 0.98 64%, 0.99 74.4%, 1 86.4%, 1 100%)",
  };
  const hasNoVariation = ["default", "fastInSlowOut", "smoothStep", "elastic", "bounce", "emphasis"];

  let needsInit = true, animateModals = true, animateLibraries = true, animateButtons = true,
    animationSpeed = 1, animationType = "default", animationDir = "InOut";
  let patchedBody = false, sbPatched = false, sbEverPatched = false, listenerAttached = false;

  const genStyles = () => `
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
  styleElement.textContent = genStyles();
  document.head.appendChild(styleElement);
  
  let animationEnabled = !mediaQuery.matches;
  mediaQuery.addEventListener("change", (e) => {
    animationEnabled = !e.matches;
  });

  function requestAddonState() {
    animateModals = addon.settings.get("animateModals");
    animateLibraries = addon.settings.get("animateLibraries");
    animateButtons = addon.settings.get("animateButtons");
    animationType = addon.settings.get("animationType");
    animationDir = addon.settings.get("animationDir");
    const oldSpeed = animationSpeed;
    animationSpeed = 1 / (Number(addon.settings.get("animateSpeed")) / 100);
    if (oldSpeed !== animationSpeed) styleElement.textContent = genStyles();
  }

  function getEasing() {
    if (hasNoVariation.includes(animationType)) {
      return animationTypes[animationType];
    } else {
      return animationTypes[animationType + animationDir];
    }
  }

  function getAnim(time) {
    time *= animationSpeed;
    return `${time}s ${getEasing()}`;
  };

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
        { duration: animTime * animationSpeed, easing: getEasing() }
      );
      animation.onfinish = () => {
        element.style.overflow = "";
      };
      return;
    }

    element = elementName === "addonModal" ? document.querySelector(`div[class^="modal_modal-overlay"] div[class*="modal_modal-content"]`)
        : document.querySelector(`div[class="ReactModalPortal"] div[class*="ReactModal__Overlay"]`)?.firstChild;
    if (!element) return;
    if (type === "library") {
      animTime = 500;
      if (elementName === "extensionLibrary" || elementName === "costumeLibrary") element.style.transformOrigin = "left bottom";
      else element.style.transformOrigin = "center bottom";
    }

    element.animate(
      [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
      { duration: animTime * animationSpeed, easing: getEasing() }
    );
  }

  function attachCloseHijack(elementName) {
    const type = elementName.endsWith("Library") ? "library" : elementName.endsWith("Menu") ? "menu" : "modal";
    if (type === "menu" || patchedBody) return;

    if (!animateLibraries && type === "library") return;
    if (!animateModals && type !== "library") return;

    // Monkey Patch
    const ogRemoveChild = document.body.constructor.prototype.removeChild;
    document.body.constructor.prototype.removeChild = function(child) {
      const element = elementName === "addonModal" ? document.querySelector(`div[class^="modal_modal-overlay"]`)
        : document.querySelector(`div[class="ReactModalPortal"]`);
      if (!element) return ogRemoveChild.call(this, child);

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
            { duration: animTime * animationSpeed, easing: getEasing() }
          );
          const animation = animClone.firstChild.animate(
            [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(0)", opacity: 0 }],
            { duration: animTime * animationSpeed, easing: getEasing() }
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
            { duration: 300, easing: getEasing() }
          );
        } else {
          collapser.style.transform = "rotateY(0deg)";
          const animation = filterDiv.animate(
            [{ width: "342px", opacity: 1 }, { width: "0px", opacity: 0 }],
            { duration: 300, easing: getEasing() }
          );
          animation.onfinish = () => {
              collapser.setAttribute("closed", "true");
              filterDiv.style.display = "none";
          };
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

      const ogSBCustomPrompt = ScratchBlocks.customPrompt;
      ScratchBlocks.customPrompt = function(...args) {
        const modal = ogSBCustomPrompt.call(this, ...args);

        if (modal) handleOpenAnimation("modal");
        else queueMicrotask(() => handleOpenAnimation("modal"));
        attachCloseHijack("modal");

        return modal;
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

      /* addon modal API */
      window.vm.on("ADDON_WORKER_MODAL", () => {
        handleOpenAnimation("addonModal");
        attachCloseHijack("addonModal");
      });
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

  addon.settings.addEventListener("change", requestAddonState);
  addon.self.addEventListener("disabled", () => {
    animateModals = false;
    animateLibraries = false;
    animateButtons = false;
  });
  addon.self.addEventListener("reenabled", () => {
    animateModals = true;
    animateLibraries = true;
    animateButtons = true;
  });
}
