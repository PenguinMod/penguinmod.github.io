import addSmallStageClass from "../../libraries/common/cs/small-stage.js";

export default async function ({ addon, console, msg }) {
  const vm = addon.tab.traps.vm;

  let showOnProjectPage = addon.settings.get("projectpage");
  let showIconOnly = addon.settings.get("showicononly");

  addSmallStageClass();

  let countContainerContainer = document.createElement("div");
  addon.tab.displayNoneWhileDisabled(countContainerContainer);

  let countContainer = document.createElement("div");
  let count = document.createElement("span");
  let icon = document.createElement("span");

  countContainerContainer.className = "clone-container-container";
  countContainer.className = "clone-container";
  count.className = "clone-count";
  icon.className = "clone-icon";

  countContainerContainer.appendChild(icon);
  countContainerContainer.appendChild(countContainer);
  countContainer.appendChild(count);

  let lastChecked = 0;

  const cache = Array(301)
    .fill()
    .map((_, i) => msg("clones", { cloneCount: i }));

  function doCloneChecks(force) {
    const v = vm.runtime._cloneCounter;
    // performance
    if (v === lastChecked && !force) return;
    lastChecked = v;
    if (v === 0) {
      countContainerContainer.dataset.count = "none";
    } else if (v >= vm.runtime.runtimeOptions.maxClones) {
      countContainerContainer.dataset.count = "full";
    } else {
      countContainerContainer.dataset.count = "";
    }
    if (showIconOnly) {
      count.dataset.str = v;
    } else {
      count.dataset.str = cache[v] || msg("clones", { cloneCount: v });
    }

    if (v === 0 || (addon.tab.editorMode !== "editor" && !showOnProjectPage)) countContainerContainer.style.display = "none";
    else countContainerContainer.style.display = "flex";
  }

  addon.settings.addEventListener("change", () => {
    showIconOnly = addon.settings.get("showicononly");
    showOnProjectPage = addon.settings.get("projectpage");
    doCloneChecks(true);
  });

  const oldStep = vm.runtime._step;
  vm.runtime._step = function (...args) {
    const ret = oldStep.call(this, ...args);
    doCloneChecks();
    return ret;
  };

  /*
  if (addon.self.enabledLate) {
    // Clone count might be inaccurate if the user deleted sprites
    // before enabling the addon
    let count = 0;
    for (let target of vm.runtime.targets) {
      if (!target.isOriginal) ++count;
    }
    vm.runtime._cloneCounter = count;
  }
  */

  while (true) {
    await addon.tab.waitForElement('[class*="controls_controls-container"]', {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
    });

    if (showOnProjectPage || addon.tab.editorMode === "editor" || addon.tab.redux.state.scratchGui.mode.isEmbedded) {
      addon.tab.appendToSharedSpace({ space: "afterStopButton", element: countContainerContainer, order: 2 });
      doCloneChecks(true);
    }
  }
}