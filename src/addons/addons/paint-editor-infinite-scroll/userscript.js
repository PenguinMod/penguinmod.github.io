export default async function ({ addon, console }) {

  const paper = await addon.tab.traps.getPaper();
  const s = addon.settings;
  addon.tab.redux.initialize();

  const paintView = await import("scratch-paint/src/helper/view.js");
  const { getSelectedRootItems } = await import("scratch-paint/src/helper/selection.js");
  const { updateViewBounds } = await import("scratch-paint/src/reducers/view-bounds.js");
  const { isVector } = await import("scratch-paint/src/lib/format.js");
  const BIG = 1e7; // MAX_WORKSPACE_BOUNDS in helper/view.js Risk of a loss in decimal precision
  const CELL = 8; // CHECKERBOARD_SIZE in helper/layer.js
  const PERIOD = CELL * 2;
  const TILE_OPACITY = 0.55;
  const MAX_TILE_POINTS = 20000;
  const PERCENT_PER_ZOOM = 100;

  const STORAGE_KEY = "sa-paint-infinite-enabled";
  const storedEnabled = localStorage.getItem(STORAGE_KEY);
  let enabled = storedEnabled === null ? true : storedEnabled === "true";
  if (storedEnabled === null) localStorage.setItem(STORAGE_KEY, String(enabled));

  let allowOnce = false;
  let wasActive = false;
  let gridDirty = true;

  const hasView = () => !!(paper.project && paper.project.view && paper.project.view.element);
  const isVectorFormat = () => {
    const f = addon.tab.redux.state?.scratchPaint?.format;
    return typeof f === "string" ? isVector(f) : true; // fallback to true if the format is not yet known
  };
  const isActive = () => !addon.self.disabled && enabled && hasView() && isVectorFormat();

  const getArtSize = () => ({ w: paintView.ART_BOARD_WIDTH, h: paintView.ART_BOARD_HEIGHT });

  const refresh = (clipEmpty = false) => {
    // force the view bounds and scroll to update
    if (!hasView()) return;
    if (clipEmpty) paintView.setWorkspaceBounds(true);
    paintView.clampViewBounds();
    addon.tab.redux.dispatch(updateViewBounds(paper.view.matrix));
  };

  //  MAX_WORKSPACE_BOUNDS 
  const layersReady = () => {
    if (!paper.project) return false;
    const layer = paper.project.layers.find((l) => l.data && l.data.isBackgroundGuideLayer);
    return !!(layer && layer.vectorBackground);
  };
  const maxEnlarged = () => paintView.MAX_WORKSPACE_BOUNDS.width >= BIG;

  const applyMax = (active) => {
    const r = paintView.MAX_WORKSPACE_BOUNDS;
    if (active) {
      if (r.width >= BIG || !layersReady()) return false;
      r.x = -BIG;
      r.y = -BIG;
      r.width = BIG * 2;
      r.height = BIG * 2;
      return true;
    }
    if (r.width < BIG) return false;
    const { w, h } = getArtSize();
    r.x = -w / 4;
    r.y = -h / 4;
    r.width = w * 1.5;
    r.height = h * 1.5;
    return true;
  };

  //  Stop the core from pushing the view back into the workspace 
  const installView = (view) => {
    if (view.__saInfiniteInstalled) return;
    view.__saInfiniteInstalled = true;
    wasActive = false;
    const origScrollBy = view.scrollBy;
    view.scrollBy = function (...args) {
      if (!isActive() || !maxEnlarged()) return origScrollBy.apply(this, args);
      if (allowOnce) {
        allowOnce = false;
        return origScrollBy.apply(this, args);
      }
      return this;
    };
  };

  //  Clip mask of the painting layer 
  let maskCache = null;
  const findMask = () => {
    const layer = paper.project.layers.find((l) => l.data && l.data.isPaintingLayer);
    if (!layer) return null;
    if (maskCache && maskCache.parent === layer && maskCache.clipMask) return maskCache;
    maskCache = null;
    for (let i = layer.children.length - 1; i >= 0; i--) {
      const c = layer.children[i];
      if (c.clipMask && c.guide && c.locked) {
        maskCache = c;
        break;
      }
    }
    return maskCache;
  };
  const applyMask = (active) => {
    if (!isVectorFormat()) return;
    const mask = findMask();
    if (!mask) return;
    if (active) {
      if (mask.size.width < BIG) mask.size = new paper.Size(BIG * 2, BIG * 2);
    } else if (mask.size.width >= BIG) {
      const { w, h } = getArtSize();
      mask.size = new paper.Size(w * 1.5, h * 1.5);
    }
  };

  //  Infinite checkerboard grid 
  let grid = null;
  const getBackgroundLayer = () =>
    paper.project.layers.find((l) => l.data && l.data.isBackgroundGuideLayer);

  const readColors = () => {
    const layer = getBackgroundLayer();
    const vb = layer && layer.vectorBackground;
    const pick = (getter, fallback) => {
      try {
        const c = getter();
        return c ? c.toCSS(true) : fallback;
      } catch (e) {
        return fallback;
      }
    };
    return {
      workspace: pick(() => vb.children[0].fillColor, "#ECF1F9"),
      white: pick(() => vb.children[1].children[0].fillColor, "#FFFFFF"),
      tile: pick(() => vb.children[1].children[1].fillColor, "#D9E3F2"),
    };
  };
  const readParity = () => {
    const layer = getBackgroundLayer();
    try {
      const path = layer.vectorBackground.children[1].children[1];
      const o = path.localToGlobal(path.firstSegment.point);
      return (Math.round(o.x / CELL) + Math.round(o.y / CELL)) & 1;
    } catch (e) {
      return 1;
    }
  };

  const ensureGrid = (layer) => {
    if (grid && grid.group.parent === layer) return grid;
    if (grid) grid.group.remove();
    const group = new paper.Group({ insert: false });
    group.guide = true;
    group.locked = true;
    layer.addChild(group);
    if (layer.dragCrosshair) group.insertBelow(layer.dragCrosshair);
    grid = { group, fill: null, white: null, tiles: null, block: null, sig: "", colors: {} };
    return grid;
  };

  const buildCheckerPoints = (ox, oy, cols, rows) => {
    const pts = [];
    let x = 0;
    let y = 0;
    while (x < cols) {
      pts.push(new paper.Point(ox + x * CELL, oy + y * CELL));
      x++;
      pts.push(new paper.Point(ox + x * CELL, oy + y * CELL));
      y = y === 0 ? rows : 0;
    }
    y = rows - 1;
    x = cols;
    while (y > 0) {
      pts.push(new paper.Point(ox + x * CELL, oy + y * CELL));
      x = x === 0 ? cols : 0;
      pts.push(new paper.Point(ox + x * CELL, oy + y * CELL));
      y--;
    }
    return pts;
  };

  const rebuildGrid = (g, vb, parity, art, tilesOn, sig) => {
    const span = Math.max(vb.width, vb.height);
    const x0 = Math.floor((vb.left - span) / PERIOD) * PERIOD - PERIOD;
    const y0 = Math.floor((vb.top - span) / PERIOD) * PERIOD - PERIOD;
    const x1 = Math.ceil((vb.right + span) / PERIOD) * PERIOD + PERIOD;
    const y1 = Math.ceil((vb.bottom + span) / PERIOD) * PERIOD + PERIOD;
    const cols = (x1 - x0) / CELL - parity * 2;
    const rows = (y1 - y0) / CELL;

    const style = (item) => {
      item.guide = true;
      item.locked = true;
      item.strokeColor = null;
      return item;
    };
    const fill = style(new paper.Path.Rectangle({ from: [x0, y0], to: [x1, y1], insert: false }));
    const white = style(new paper.Path.Rectangle({ point: [0, 0], size: [art.w, art.h], insert: false }));
    const tiles = style(
      new paper.Path({
        segments: buildCheckerPoints(x0 + parity * CELL, y0, cols, rows),
        fillRule: "evenodd",
        insert: false,
      })
    );
    tiles.opacity = TILE_OPACITY;
    tiles.visible = tilesOn && cols + rows <= MAX_TILE_POINTS;

    g.group.removeChildren();
    g.group.addChildren([fill, white, tiles]);
    g.fill = fill;
    g.white = white;
    g.tiles = tiles;
    g.block = { x0: x0 + PERIOD, y0: y0 + PERIOD, x1: x1 - PERIOD, y1: y1 - PERIOD };
    g.sig = sig;
    g.colors = {};
  };

  const needsRebuild = (g, vb, sig) => {
    const b = g.block;
    if (!b || !g.fill || g.sig !== sig) return true;
    if (vb.left < b.x0 || vb.top < b.y0 || vb.right > b.x1 || vb.bottom > b.y1) return true;
    return b.x1 - b.x0 > Math.max(vb.width, vb.height) * 12;
  };

  const updateGridColors = (g) => {
    const c = readColors();
    if (g.colors.workspace !== c.workspace) g.fill.fillColor = c.workspace;
    if (g.colors.white !== c.white) g.white.fillColor = c.white;
    if (g.colors.tile !== c.tile) g.tiles.fillColor = c.tile;
    g.colors = c;
  };

  const updateGrid = () => {
    if (!hasView()) return;
    const layer = getBackgroundLayer();
    if (!layer) return;
    const want = isActive() && !!s.get("infinite-grid");
    if (!want) {
      if (grid && grid.group.parent === layer) grid.group.visible = false;
      return;
    }
    const g = ensureGrid(layer);
    g.group.visible = true;

    const vb = paper.view.bounds;
    const parity = readParity();
    const art = getArtSize();
    const tilesOn = CELL * paper.view.zoom >= 2;
    const sig = [parity, art.w, art.h, tilesOn].join(",");
    if (needsRebuild(g, vb, sig)) rebuildGrid(g, vb, parity, art, tilesOn, sig);
    updateGridColors(g);
  };

  //  Zoom 
  const zoomStep = (z) =>
    0.5 * (s.get("zoom-speed") / 100) * Math.pow(z / 0.5, s.get("zoom-correction") / 100);
  const clampZoom = (z) => {
    if (!isActive()) return Math.max(paintView.OUTERMOST_ZOOM_LEVEL, z);
    const minZ = s.get("min-zoom") / 100;
    let maxZ = s.get("max-zoom") / 100;
    maxZ = maxZ > 0 ? Math.max(maxZ, minZ) : Infinity;
    return Math.max(minZ, Math.min(maxZ, z));
  };
  const nextButtonZoom = (z, zoomIn) => {
    if (zoomIn) {
      let t = z + zoomStep(z);
      if (z < 0.5 - 1e-6 && t > 0.5) t = 0.5;
      return Math.max(z, clampZoom(t));
    }
    let lo = 0;
    let hi = z;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (mid + zoomStep(mid) > z) hi = mid;
      else lo = mid;
    }
    return Math.min(z, clampZoom((lo + hi) / 2));
  };

  const zoomAt = (target, fixedPoint) => {
    const view = paper.view;
    if (!(target > 0) || target === view.zoom) return;
    const preZoomCenter = view.center;
    const scaling = view.zoom / target;
    const preZoomOffset = fixedPoint.subtract(preZoomCenter);
    const postZoomOffset = fixedPoint.subtract(preZoomOffset.multiply(scaling)).subtract(preZoomCenter);
    view.zoom = target;
    view.translate(postZoomOffset.multiply(-1));
    paintView.resizeCrosshair();
    refresh();
    addon.tab.redux.dispatch({ type: "scratch-paint/select/REDRAW_SELECTION_BOX" });
  };

  const getZoomAnchor = () => {
    const items = getSelectedRootItems();
    if (items.length > 0) {
      let rect = null;
      for (const item of items) rect = rect ? rect.unite(item.bounds) : item.bounds;
      return rect.center;
    }
    return paper.view.center;
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (!isActive() || e.target !== paper.view.element) return;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const view = paper.view;
        const mult = e.deltaMode === 1 ? 15 : 1;
        const base = -(e.deltaY * mult) / 500;
        if (!base) return;
        const scaled = base * (s.get("zoom-speed") / 100) * Math.pow(view.zoom / 0.5, s.get("zoom-correction") / 100);
        let target = clampZoom(view.zoom + scaled);
        target = scaled > 0 ? Math.max(view.zoom, target) : Math.min(view.zoom, target);
        const rect = view.element.getBoundingClientRect();
        zoomAt(target, view.viewToProject(new paper.Point(e.clientX - rect.left, e.clientY - rect.top)));
      } else {
        allowOnce = true;
      }
    },
    { capture: true, passive: false }
  );
  window.addEventListener("wheel", () => {
    allowOnce = false;
  });

  window.addEventListener(
    "click",
    (e) => {
      if (!isActive() || e.button !== 0) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      const controls = t.closest("[class*='paint-editor_zoom-controls']");
      if (!controls) return;
      const icon = Array.from(controls.querySelectorAll("img")).find(
        (i) => i === t || (i.parentElement && i.parentElement.contains(t))
      );
      const alt = icon && icon.getAttribute("alt");
      if (alt !== "Zoom In" && alt !== "Zoom Out") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      zoomAt(nextButtonZoom(paper.view.zoom, alt === "Zoom In"), getZoomAnchor());
    },
    true
  );

  //  Scrollbar thumbs follow the cursor 
  window.addEventListener(
    "mousedown",
    (e) => {
      if (!isActive() || e.button !== 0) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const hitbox = target.closest("[class*='scrollbar-hitbox']");
      if (!hitbox) return;
      const track = hitbox.parentElement;
      if (!track) return;
      const horizontal = /horizontal/.test(hitbox.className);
      const hb = hitbox.getBoundingClientRect();
      const tb = track.getBoundingClientRect();
      const thumbLen = horizontal ? hb.width : hb.height;
      const trackLen = horizontal ? tb.width : tb.height;
      if (!thumbLen || !trackLen || thumbLen >= trackLen * 0.995) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const ws = paintView.getWorkspaceBounds();
      const unitsPerPx = (horizontal ? ws.width : ws.height) / trackLen;
      let last = horizontal ? e.clientX : e.clientY;

      const onMove = (ev) => {
        const cur = horizontal ? ev.clientX : ev.clientY;
        const units = (cur - last) * unitsPerPx;
        last = cur;
        if (!units) return;
        paper.view.translate(new paper.Point(horizontal ? -units : 0, horizontal ? 0 : -units));
        refresh();
        ev.preventDefault();
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    true
  );

  //  UI: zoom percentage + button 
  const group = document.createElement("div");
  group.className = "sa-paint-infinite-group";
  addon.tab.displayNoneWhileDisabled(group);

  const zoomInput = document.createElement("input");
  zoomInput.className = "sa-paint-infinite-zoom";
  zoomInput.type = "text";
  zoomInput.title = "Zoom (click to edit)";
  zoomInput.setAttribute("aria-label", "Zoom");
  zoomInput.spellcheck = false;
  group.appendChild(zoomInput);

  const currentPercent = () => Math.round(paper.view.zoom * PERCENT_PER_ZOOM);
  const updateZoomLabel = () => {
    if (!hasView() || document.activeElement === zoomInput) return;
    const text = `${currentPercent()}%`;
    if (zoomInput.value !== text) zoomInput.value = text;
  };
  zoomInput.addEventListener("focus", () => {
    if (!hasView()) return;
    zoomInput.value = String(currentPercent());
    zoomInput.select();
  });
  zoomInput.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      const percent = parseFloat(zoomInput.value.replace("%", ""));
      if (hasView() && Number.isFinite(percent) && percent > 0) {
        zoomAt(clampZoom(percent / PERCENT_PER_ZOOM), paper.view.center);
      }
      zoomInput.blur();
    } else if (e.key === "Escape") {
      zoomInput.blur();
    }
  });
  zoomInput.addEventListener("blur", () => {
    zoomInput.setSelectionRange(0, 0);
    updateZoomLabel();
  });

  const button = document.createElement("span");
  button.className = "sa-paint-infinite-button";
  button.setAttribute("role", "button");
  button.title = "Infinite scroll (vector only)";
  button.dataset.enabled = enabled;

  const img = document.createElement("img");
  img.className = "sa-paint-infinite-image";
  img.draggable = false;
  img.src = addon.self.getResource("/icons/infinite.svg");
  button.appendChild(img);
  group.appendChild(button);

  button.addEventListener("click", () => {
    enabled = !enabled;
    localStorage.setItem(STORAGE_KEY, String(enabled));
    button.dataset.enabled = enabled;
    sync();
  });

  const updateVisibility = () => {
    const showButton = !!s.get("show-button");
    const showZoom = !!s.get("show-zoom-percent");
    button.style.display = showButton ? "" : "none";
    zoomInput.style.display = showZoom ? "" : "none";
    group.dataset.hidden = String(!isVectorFormat() || (!showButton && !showZoom));
  };

  //  State sync 
  const sync = () => {
    if (!hasView()) return;
    installView(paper.project.view);
    const active = isActive();
    const maxChanged = applyMax(active);
    applyMask(active);
    updateVisibility();
    gridDirty = true;
    if (active !== wasActive || maxChanged) {
      wasActive = active;
      refresh();
    }
  };
  let scheduled = false;
  const scheduleSync = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      sync();
    });
  };
  addon.tab.redux.addEventListener("statechanged", scheduleSync);
  addon.self.addEventListener("disabled", scheduleSync);
  addon.self.addEventListener("reenabled", scheduleSync);

  s.addEventListener("change", () => {
    sync();
  });

  //  Per-frame polling 
  let lastSig = [];
  let warned = false;
  const loop = () => {
    requestAnimationFrame(loop);
    try {
      if (!hasView()) return;
      if (isActive() && !maxEnlarged() && layersReady()) sync();
      if (grid && grid.fill && grid.group.visible && isActive()) updateGridColors(grid);
      const m = paper.view.matrix;
      const vs = paper.view.viewSize;
      const sig = [m.a, m.b, m.c, m.d, m.tx, m.ty, vs.width, vs.height];
      if (!gridDirty && sig.every((v, i) => v === lastSig[i])) return;
      lastSig = sig;
      gridDirty = false;
      updateGrid();
      updateZoomLabel();
    } catch (e) {
      if (!warned) {
        warned = true;
        console.error(e);
      }
    }
  };
  requestAnimationFrame(loop);
  sync();

  //  Place the group next to the zoom controls 
  let hasRunOnce = false;
  while (true) {
    const canvasControls = await addon.tab.waitForElement("[class^='paint-editor_canvas-controls']", {
      markAsSeen: true,
      reduxEvents: [
        "scratch-gui/navigation/ACTIVATE_TAB",
        "scratch-gui/mode/SET_PLAYER",
        "fontsLoaded/SET_FONTS_LOADED",
        "scratch-gui/locales/SELECT_LOCALE",
        "scratch-gui/targets/UPDATE_TARGET_LIST",
      ],
      reduxCondition: (state) =>
        state.scratchGui.editorTab.activeTabIndex === 1 && !state.scratchGui.mode.isPlayerOnly,
    });
    const zoomControlsContainer = canvasControls.querySelector("[class^='paint-editor_zoom-controls']");
    addon.tab.appendToSharedSpace({
      space: "paintEditorZoomControls",
      element: group,
      order: 3,
    });
    if (!hasRunOnce) {
      hasRunOnce = true;
      const groupClass = zoomControlsContainer.firstChild.className;
      const buttonClass = zoomControlsContainer.firstChild.firstChild.className;
      const imageClass = zoomControlsContainer.firstChild.firstChild.firstChild.className;
      group.className += " " + groupClass;
      button.className += " " + buttonClass;
      img.className += " " + imageClass;
    }
    sync();
    updateZoomLabel();
  }
}
