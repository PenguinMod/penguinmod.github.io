// Costume Tool Panel
// By: SharkPool & DogeisCut
export default async function () {
    const runtime = vm.runtime;
    const isPM = true;

    const panelTag = Symbol("costume-tools-tag");
    const valueObserverObj = { r: 0, sx: 1, sy: 1, kx: 0, ky: 0, outlineRatio: 1 };
    const panelID = "costume-editor-panel";
    const epsilon = 1e-8;
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;

    const guiIMGS = {
        "panel": `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="10.796" y="6.222" width="4.813" height="2.174" rx=".5" ry=".5" fill="#fff" fill-rule="evenodd" stroke="#575e75" stroke-width=".75"/><path fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width=".75" style="paint-order:markers stroke fill" d="M3 3h14v14H3z"/><g fill="#fff" fill-rule="evenodd" stroke-width=".75"><path stroke="red" stroke-linecap="round" stroke-linejoin="round" style="paint-order:markers fill stroke" d="M3 3h14v1.896H3z"/><rect x="10.796" y="9.722" width="4.813" height="2.174" rx=".5" ry=".5" stroke="#575e75"/><rect x="10.796" y="13.222" width="4.813" height="2.174" rx=".5" ry=".5" stroke="#575e75"/></g><path d="M9.563 7.309H4.242m5.321 6.978H4.242m5.321-3.478H4.242" style="paint-order:markers stroke fill" fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width=".75"/></svg>`,
        "lock": `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="40.98" viewBox="0 0 38 40.98"><path d="M19.086 0c7.566 0 13.903 5.707 13.903 12.912q0 .499-.046.987h1.083A3.98 3.98 0 0 1 38 17.879v19.125a3.98 3.98 0 0 1-3.974 3.976H3.977A3.98 3.98 0 0 1 0 37V17.875a3.98 3.98 0 0 1 3.98-3.976h24.974a8 8 0 0 0 .064-.987c0-4.863-4.333-8.937-9.931-8.937-3.266 0-6.127 1.409-7.922 3.53-.266.315-1.459 1.852-1.803 2.95-.568 1.815-.262 3.397-.262 3.397l-4.026.07S4.153 9.1 7.655 5.311C11.249 1.421 14.994 0 19.086 0" fill="red" fill-rule="evenodd"/></svg>`,
        "unlock": `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="40.98" viewBox="0 0 38 40.98"><path d="M18.913 0c4.412 0 8.388 1.907 10.956 4.948.705.84.598 2.093-.24 2.801a1.99 1.99 0 0 1-2.793-.244c-1.795-2.121-4.656-3.53-7.922-3.53-5.598 0-9.931 4.074-9.931 8.937q0 .495.064.987h24.974a3.98 3.98 0 0 1 3.98 3.976V37a3.98 3.98 0 0 1-3.976 3.98H3.972A3.98 3.98 0 0 1 0 37.004V17.879a3.98 3.98 0 0 1 3.972-3.98h1.083q-.045-.49-.045-.987C5.01 5.707 11.347 0 18.913 0" fill="red" fill-rule="evenodd"/></svg>`,
        "exit": `<svg viewBox="-10 7 20 20" xmlns="http://www.w3.org/2000/svg"><path transform="rotate(45)" fill="red" d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"></path></svg>`,
    };
    const blendingModes = [
        "normal", "multiply", "screen", "overlay",
        "soft-light", "hard-light",
        "color-dodge", "color-burn",
        "darken", "lighten",
        "difference", "exclusion",
        "hue", "saturation", "color", "luminosity"
    ];
    const outlineTypes = [
        { text: "thorn", value: "miter" },
        { text: "round", value: "round" },
        { text: "bevel", value: "bevel" }
    ];
    const tools = [
        {
            title: "Position",
            items: [
                { title: "x", input: "number", params: "x" },
                { title: "y", input: "number", params: "y" },
                { title: "Group Position", id: "groupPosition", input: "toggler" },
            ]
        },
        {
            title: "Rotation",
            items: [
                { title: "direction", input: "number", params: "dir" },
                "br",
                { title: "Group Rotation", id: "groupRotate", input: "toggler" },
            ]
        },
        {
            title: "Scaling",
            items: [
                { title: "x", input: "number", params: "sx" },
                { title: "y", input: "number", params: "sy" },
                "br",
                { title: "width", input: "monitor", params: "width" },
                { title: "height", input: "monitor", params: "height" },
                "br",
                { title: "Group Scaling", id: "groupScale", input: "toggler" },
                "br",
                { title: "Scale Outlines", id: "strokeScale", input: "toggler" },
            ]
        },
        {
            title: "Skewing",
            items: [
                { title: "x", input: "number", params: "sx" },
                { title: "y", input: "number", params: "sy" },
                { title: "Group Skewing", id: "groupSkew", input: "toggler" },
            ]
        },
        {
            title: "Layering", noBitmap: true,
            items: [{ title: "order", input: "number", params: "layer" }]
        },
        {
            title: "Blending", noBitmap: true,
            items: [{ title: "mode", input: "select", params: "blend" }]
        },
        {
            title: "Outlines", noBitmap: true,
            items: [
                { title: "type", input: "select", params: "outlineType" },
                { title: "dash", input: "number", params: "outlineDash" }
            ]
        }
    ];

    let modalStorage = {};
    let isPatched = false, sessionCenterNeedsUpdate = false, updatesAllowed = true;

  	/* Patches */
  	function applyPatches() {
  	    // we need to store the original rotation, scale, and skew as these functions
  	    // CHANGE, not SET, the items attributes
  	    isPatched = true;
  	    const ogRotate = paper.Item.prototype.rotate;
        paper.Item.prototype.rotate = function(...args) {
            const realAngle = typeof args[0] === "number" ? args[0] : 0;
            for (const child of this._children ?? [this]) {
                if (!child[panelTag]) child[panelTag] = structuredClone(valueObserverObj);
                child[panelTag].r += realAngle;
            }
            return ogRotate.call(this, ...args);
        };

        /* Scratch-Paint uses Group.scale, not Item */
        const ogScale = paper.Group.prototype.scale;
        paper.Group.prototype.scale = function(...args) {
            const sx = typeof args[0] === "number" ? args[0] : 1;
            const sy = typeof args[1] === "number" ? args[1] : sx;
            for (const child of this._children ?? [this]) {
                if (!child[panelTag]) child[panelTag] = structuredClone(valueObserverObj);
                child[panelTag].sx *= sx;
                child[panelTag].sy *= sy;
            }
            return ogScale.call(this, ...args);
        };

        const ogShear = paper.Item.prototype.shear;
        paper.Item.prototype.shear = function(...args) {
            const kx = typeof args[0] === "number" ? args[0] : 1;
            const ky = typeof args[1] === "number" ? args[1] : kx;
            for (const child of this._children ?? [this]) {
                if (!child[panelTag]) child[panelTag] = structuredClone(valueObserverObj);
                child[panelTag].kx += Math.atan(kx) * toDeg;
                child[panelTag].ky += Math.atan(ky) * toDeg;
            }
            return ogShear.call(this, ...args);
        };
  	}

    /* Internal Utils */
    function _getSpecialLayer(layerString) {
        for (const layer of paper.project.layers) {
            if (layer.data && layer.data[layerString]) return layer;
        }
    }

    function getRealSelection() {
        return ReduxStore.getState().scratchPaint.selectedItems;
    }

    function apply2Selection(selectedItems = [], func, value) {
        for (const item of selectedItems) func(item, value);

        queueMicrotask(() => {
            updateMonitors();
            if (sessionCenterNeedsUpdate) {
                // perform tasks for bounding box updates
                modalStorage.sessionStore = { center: getCenter(selectedItems) };
                sessionCenterNeedsUpdate = false;
            }

            const tool = paper.tool;
            if (typeof tool.boundingBoxTool?.setSelectionBounds === "function") tool.boundingBoxTool.setSelectionBounds();
            if (typeof tool.onUpdateImage === "function") {
                // dash array is doubled when drawn on the stage, we need to half the value
                // before sending to the stage
                const changedItems = [];
                for (const item of selectedItems) {
                    if (item.dashArray.length) {
                        changedItems.push(item);
                        item.dashArray[0] /= 2;
                    }
                }
                tool.onUpdateImage();
                for (const item of changedItems) {
                    item.dashArray[0] *= 2;
                }
            }
        });
    }

    function isGrouped(item) {
        const parent = item.getParent();
        if (parent.data && parent.data.isPaintingLayer) return false;
        return true;
    }

    function getCenter(selectedItems) {
      if (selectedItems.every(i => isGrouped(i))) {
          const parent = selectedItems[0].getParent();
          const bounds = parent.getBounds();
          return [bounds.centerX, bounds.centerY];
      } else {
          const groupBounds = paper.Rectangle.create(selectedItems.map(i => i.bounds))
            .reduce((a, b) => a.unite(b));
          return [groupBounds.centerX, groupBounds.centerY];
      }
    }

    function positionItem(item, value, isX, isLocked) {
        const currentPos = item.getPosition();
        if (isLocked) {
            const session = modalStorage.sessionStore;
            if (!session[item._id]) {
                const center = session.center;
                session[item._id] = [currentPos.x - center[0], currentPos.y - center[1]];
            }

            const offset = session[item._id];
            if (isX) item.setPosition(value + offset[0], currentPos.y);
            else item.setPosition(currentPos.x, value + offset[1]);
        } else {
            if (isX) item.setPosition(value, currentPos.y);
            else item.setPosition(currentPos.x, value);
        }
    }

    function rotateItem(item, degrees, isLocked) {
        if (isLocked) {
            item.rotate(degrees, modalStorage.sessionStore.center);
            sessionCenterNeedsUpdate = true;
        } else {
            item.rotate(degrees);
        }
    }

    function scaleItem(item, value, isX, isLocked, strokeUpdate) {
        if (isLocked) {
            if (isX) item.scale(value, 1, modalStorage.sessionStore.center);
            else item.scale(1, value, modalStorage.sessionStore.center);
            sessionCenterNeedsUpdate = true;
        } else {
            if (isX) item.scale(value, 1);
            else item.scale(1, value);
        }

        if (strokeUpdate && item.strokeWidth) {
            const meta = item[panelTag];
            const newStrokeScale = Math.sqrt(meta.sx * meta.sy);

            item.strokeWidth *= newStrokeScale / meta.outlineRatio;
            meta.outlineRatio = newStrokeScale;
        }
    }

    function skewItem(item, x, y, isLocked) {
        let pivot = isLocked ? new paper.Point(modalStorage.sessionStore.center) : item.bounds.center;

        item.translate(pivot.multiply(-1));
        item.shear(Math.tan(x * toRad), Math.tan(y * toRad));
        item.translate(pivot);

        sessionCenterNeedsUpdate = true;
    }

    /* GUI Utils */
    function getButtonURI(name, dontCompile) {
        const themeHex = isPM ? "#00c3ff" : document.documentElement.style.getPropertyValue("--looks-secondary") || "#ff4c4c";
        const guiSVG = guiIMGS[name].replaceAll("red", themeHex);
        if (dontCompile) return guiSVG;
        else return "data:image/svg+xml;base64," + btoa(guiSVG);
    }

    function getToolParams(name, selectedItems = []) {
        const item1 = selectedItems[0];
        const isX = name.endsWith("x");
        switch (name) {
            case "Position/x":
            case "Position/y": {
                if (selectedItems.length > 1) {
                    if (modalStorage["groupPosition"]) return {
                        max: 15000,
                        value: isX ? getCenter(selectedItems)[0] - runtime.stageWidth 
                            : (getCenter(selectedItems)[1] - runtime.stageHeight) * -1
                    };
                    return { value: "", max: 15000, placeholder: "mixed" };
                }
                return {
                    max: 15000,
                    value: isX ? item1.getPosition().x - runtime.stageWidth 
                        : (item1.getPosition().y - runtime.stageHeight) * -1
                };
            }
            case "Rotation/direction": {
                if (selectedItems.length > 1) return { min: 0, max: 360, value: "", placeholder: "mixed" };
                else return {
                  min: 0, max: 360,
                  value: ((item1[panelTag]?.r ?? 0) + 90) % 180
                };
            }
            case "Scaling/x":
            case "Scaling/y": {
                if (selectedItems.length > 1) return { value: "", placeholder: "mixed" };
                else return {
                    max: 15000,
                    value: (item1[panelTag] ? isX ? item1[panelTag].sx : item1[panelTag].sy : 1) * 100
                };
            }
            case "Scaling/width":
            case "Scaling/height": {
                if (selectedItems.length > 1) {
                    const groupBounds = paper.Rectangle.create(selectedItems.map(i => i.bounds))
                        .reduce((a, b) => a.unite(b));
                    return {
                      value: (groupBounds[name.endsWith("width") ? "width" : "height"] / 2).toFixed(2)
                    };
                } else return {
                    value: (item1.getBounds()[name.endsWith("width") ? "width" : "height"] / 2).toFixed(2)
                };
            }
            case "Skewing/x":
            case "Skewing/y": {
                if (selectedItems.length > 1) return { value: "", placeholder: "mixed" };
                else return {
                    max: 15000,
                    value: item1[panelTag] ? isX ? item1[panelTag].kx : item1[panelTag].ky : 0
                };
            }
            case "Layering/order": {
                const children = _getSpecialLayer("isPaintingLayer").children;
                if (selectedItems.length > 1) {
                    return { min: 1, max: children.length - 1, value: "", placeholder: "mixed" };
                } else {
                    const index = children.length - children.indexOf(item1);
                    return {
                        min: 1, max: children.length - 1,
                        value: index - 1
                    };
                }
            }
            case "Blending/mode": {
                const options = [];
                for (const mode of blendingModes) {
                    const option = document.createElement("option");
                    option.text = mode; option.value = mode;
                    options.push(option);
                }
                return { options, value: item1.blendMode };
            }
            case "Outlines/type": {
                const options = [];
                for (const mode of outlineTypes) {
                    const option = document.createElement("option");
                    option.text = mode.text; option.value = mode.value;
                    options.push(option);
                }
                return { options, value: item1.strokeJoin };
            }
            case "Outlines/dash": {
                if (selectedItems.length > 1) return { min: 1, value: "", placeholder: "mixed" };
                else return { min: 1, value: item1.dashArray[0] ?? 0 };
            }
        }
        return {};
    }

    function getToolFunc(name) {
        const isX = name.endsWith("x");
        switch (name) {
            case "Position/x":
            case "Position/y": return (item, value) => {
                value = parseFloat(value || 0) * (isX ? 1 : -1);
                value += isX ? runtime.stageWidth : runtime.stageHeight;
                positionItem(item, value, isX, modalStorage["groupPosition"]);
            }
            case "Rotation/direction": return (item, value) => {
                value -= item[panelTag]?.r ?? 0;
                rotateItem(item, value - 90, modalStorage["groupRotate"]);
            }
            case "Scaling/x":
            case "Scaling/y": return (item, value) => {
                if (!item[panelTag]) item[panelTag] = structuredClone(valueObserverObj);
 
                value /= 100;
                if (!value) value = epsilon;
                if (isX) {
                  value /= item[panelTag].sx;
                  item[panelTag].sx *= value;
                } else {
                  value /= item[panelTag].sy;
                  item[panelTag].sy *= value;
                }

                scaleItem(item, value, isX, modalStorage["groupScale"], modalStorage["strokeScale"]);
            }
            case "Skewing/x":
            case "Skewing/y": return (item, value) => {
                if (isX) {
                  value -= item[panelTag]?.kx ?? 0;
                  skewItem(item, value, 0, modalStorage["groupSkew"]);
                } else {
                  value -= item[panelTag]?.ky ?? 0;
                  skewItem(item, 0, value, modalStorage["groupSkew"]);
                }
            }
            case "Layering/order": return (item, value) => {
                const layer = _getSpecialLayer("isPaintingLayer");
                const children = layer.children.slice();

                if (item.parent === layer) item.remove();
                layer.insertChild(children.length - value - 1, item);
            }
            case "Blending/mode": return (item, value) => item.setBlendMode(value);
            case "Outlines/type": return (item, value) => item.setStrokeJoin(value);
            case "Outlines/dash": return (item, value) => item.setDashArray([value]);
        }
    }

    /* Main GUI */
    function generateToolDisplay() {
        if (!modalStorage.toolDiv) return;
        modalStorage.id = paper.project.selectedItems.map(i => i.id).join(".");
        modalStorage.toolDiv.innerHTML = ""; // reset

        const titleStyle =  `display: block; text-align: center; border-bottom: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); padding-bottom: 5px; margin: 0 25px 0 25px; font-size: 14px; font-weight: 600;`;
        const subTitleStyle = `margin: 5px; font-size: 12px;`;
        const inputDivStyle = `display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: 5px 10px 5px 10px;`;
        const inputStyle = `text-align: center; font-size: 13px; width: 60px; height: 25px; margin: 5px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 15px;`;
        const selectStyle = `text-align: center; font-size: 13px; height: 25px; margin: 5px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px;`;
        const togglerStyle = `background: transparent; border: none; margin-left: 3px; padding: 5px 0 0 0;`;
        const monitorStyle = `text-align: center; font-size: 13px; margin: 5px; padding: 5px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px;`;

        const selectedItems = getRealSelection();
        const center = getCenter(selectedItems);

        const toolList = [];
        for (const tool of tools) {
            if (tool.noBitmap && modalStorage.format === "BITMAP") continue;
            const div = document.createElement("div");
            div.setAttribute("style", `border-bottom: dotted 2px grey; padding: 5px;`);

            const title = document.createElement("span");
            title.setAttribute("style", titleStyle);
            title.textContent = tool.title;

            const inputDiv = document.createElement("div");
            inputDiv.setAttribute("style", inputDivStyle);
            for (const item of tool.items) {
                if (item === "br") {
                    const breaker = document.createElement("div");
                    breaker.setAttribute("style", `flex-basis: 100%; height: 0;`);
                    inputDiv.appendChild(breaker);
                    continue;
                }

                const subTitle = document.createElement("span");
                subTitle.setAttribute("style", subTitleStyle);
                subTitle.textContent = item.title;

                const id = `${tool.title}/${item.title}`;
                let input;
                if (item.input === "monitor") {
                    input = document.createElement("div");
                    input.setAttribute("style", monitorStyle);
                    input.classList.add("monitor");
                    input.id = id;

                    const param = getToolParams(id, selectedItems);
                    input.textContent = param.value;
                } else if (item.input === "select") {
                    input = document.createElement("select");
                    input.setAttribute("style", selectStyle);
                    input.id = id;

                    const param = getToolParams(id, selectedItems);
                    input.append(...param.options);
                    input.value = param.value;

                    input.addEventListener("change", (e) => {
                        apply2Selection(selectedItems, getToolFunc(id), e.target.value);
                        e.stopPropagation();
                    });
                } else if (item.input === "toggler") {
                    input = document.createElement("button");
                    input.setAttribute("style", togglerStyle);
                    input.id = id;
                    if (!modalStorage[item.id]) input.style.filter = "saturate(0)"; 

                    const img = document.createElement("img");
                    img.src = getButtonURI(modalStorage[item.id] ? "lock" : "unlock");
                    img.setAttribute("width", 15);
                    input.appendChild(img);

                    input.addEventListener("click", (e) => {
                        const bool = !modalStorage[item.id];
                        modalStorage[item.id] = bool
                        input.style.filter = bool ? "saturate(1)" : "saturate(0)"; 
                        img.src = getButtonURI(bool ? "lock" : "unlock");
                        e.stopPropagation();
                    });
                } else {
                    input = document.createElement("input");
                    input.setAttribute("style", inputStyle);
                    input.id = id;
                    input.type = item.input;

                    const params = getToolParams(id, selectedItems);
                    if (params.max) input.setAttribute("max", params.max);
                    if (params.min) input.setAttribute("min", params.min);
                    if (params.placeholder) input.setAttribute("placeholder", params.placeholder);
                    else input.setAttribute("placeholder", "");
                    input.setAttribute("value", params.value);

                    input.addEventListener("input", (e) => {
                        apply2Selection(selectedItems, getToolFunc(id), e.target.value);
                        e.stopPropagation();
                    });
                }

                inputDiv.append(subTitle, input);
            }

            div.append(title, inputDiv);
            toolList.push(div);
        }

        modalStorage.toolDiv.append(...toolList);
        modalStorage.sessionStore.center = center;
    }

    function updateToolValues() {
        const selectedItems = getRealSelection();
        const toolDiv = modalStorage.toolDiv;
        if (!toolDiv) return;
        for (const tool of tools) {
            for (const item of tool.items) {
                if (item === "br") continue;

                const id = `${tool.title}/${item.title}`;
                const input = toolDiv.querySelector(`input[id="${id}"], select[id="${id}"], div[id="${id}"]`);
                if (input) {
                    const params = getToolParams(id, selectedItems);
                    if (params.value !== "") {
                      if (item.input === "monitor") input.textContent = params.value;
                      else input.value = params.value;
                    }
                }
            }
        }
    }

    function updateMonitors() {
        const selectedItems = getRealSelection();
        const toolDiv = modalStorage.toolDiv;
        if (!toolDiv) return;

        const monitors = modalStorage.toolDiv.querySelectorAll(`[class="monitor"]`);
        for (const monitor of monitors) {
            const params = getToolParams(monitor.id, selectedItems);
            if (params.value !== "") monitor.textContent = params.value;
        }
    }

    function closeToolModal() {
        const existingModal = document.querySelector(`div[class="costume-tool-modal"]`);
        if (existingModal) existingModal.remove();
    }

    function openToolPanel() {
        const paint = ReduxStore.getState().scratchPaint;
        delete modalStorage.toolDiv;
        modalStorage.format = paint.format.startsWith("BITMAP") ? "BITMAP" : "VECTOR";
        modalStorage.sessionStore = {};

        const modal = document.createElement("div");
        modal.classList.add("costume-tool-modal");
        modal.setAttribute("style", `color: var(--paint-text-primary, #575e75); width: 275px; height: 350px; z-index: 99999; display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: var(--ui-secondary, hsla(215, 75%, 95%, 1)); border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px; padding: 15px;`);
        modal.id = "draggable";

        const title = document.createElement("span");
        title.setAttribute("style", `display: block; text-align: center; justify-content: center; border-bottom: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); padding-bottom: 10px; margin: 0 25px 0 25px; font-weight: 600;`);
        title.id = "draggable";
        title.textContent = "Object Editor";

        const closeBtn = document.createElement("button");
        closeBtn.setAttribute("style", `position: absolute; top: 10px; right: 5px; transform: scale(1.2); filter: saturate(0); justify-content: center; transition: transform 0.2s, filter 0.2s; background: transparent; border: none;`);
        const exitImg = document.createElement("img");
        exitImg.src = getButtonURI("exit");
        exitImg.setAttribute("width", 20);
        closeBtn.appendChild(exitImg);
        closeBtn.addEventListener("mouseover", () => {
            closeBtn.style.transform = "scale(1.5)";
            closeBtn.style.filter = "saturate(1)";
        });
        closeBtn.addEventListener("mouseout", () => {
            closeBtn.style.transform = "scale(1.2)";
            closeBtn.style.filter = "saturate(0)";
        });
        closeBtn.addEventListener("click", (e) => {
            closeToolModal();
            e.stopPropagation();
        });

        const toolDisplay = document.createElement("div");
        toolDisplay.id = "tool-display";
        toolDisplay.setAttribute("style", `display: block; overflow-y: scroll;width: auto;height: 300px; margin-top: 15px;background: var(--ui-white);border: solid 2px grey;border-radius: 5px;`);
        modalStorage.toolDiv = toolDisplay;
        generateToolDisplay();

        modal.append(title, closeBtn, toolDisplay);
        document.body.appendChild(modal);

        // value auto-updates
        modal.addEventListener("mouseenter", () => { updatesAllowed = false });
        modal.addEventListener("mouseleave", () => { updatesAllowed = true });

        // drag n drop behaviour
        modal.addEventListener("mousedown", (e) => {
            if (e.target.id !== "draggable") return;
            e.preventDefault();

            const offsetX = e.clientX - modal.offsetLeft;
            const offsetY = e.clientY - modal.offsetTop;

            const onMouseMove = (moveEvent) => {
                const newLeft = moveEvent.clientX - offsetX;
                const newTop = moveEvent.clientY - offsetY;
                modal.style.left = `${newLeft}px`;
                modal.style.top = `${newTop}px`;
                modal.style.boxShadow = "black 5px 5px 15px";
            };

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                modal.style.boxShadow = "";
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }

    function startListenerWorker() {
        ReduxStore.subscribe((e,t) => {
            const paint = ReduxStore.getState().scratchPaint;
            if (!paint) return;

            // add panel button
            const editorRow = document.querySelector(`div[class^="paint-editor_row_"] div[class^="fixed-tools_row_"]`);
            if (!editorRow) return;
            if (!isPatched) applyPatches();

            // check if button exists
            let panelBtn = editorRow.querySelector(`div[id="${panelID}"]`);
            if (!panelBtn) {
                let groupTool = editorRow.querySelectorAll(`div[class*="input-group_input-group_"]`);
                groupTool = groupTool[2] ?? groupTool[1];

                panelBtn = document.createElement("div");
                panelBtn.setAttribute("style", `border-right: 1px dashed var(--paint-ui-pane-border, #D9D9D9); margin-right: calc(2 * .25rem); display: inline-block; padding: .25rem .325rem; min-width: 3rem; text-align: center;`);
                panelBtn.id = panelID;

                const container = document.createElement("span");
                const img = document.createElement("img");
                img.setAttribute("draggable", false);
                img.setAttribute("style", `width: 1.5rem; vertical-align: middle;`);

                const label = document.createElement("span");
                label.setAttribute("style", `display: block; margin-top: .125rem; font-size: .625rem;`);
                label.textContent = "Tools";

                container.append(img, label);
                panelBtn.appendChild(container);
                groupTool.insertAdjacentElement("afterend", panelBtn);

                panelBtn.children[0].addEventListener("click", (e) => {
                    if (paper.project.selectedItems.length) {
                        panelBtn.style.opacity = "1";
                        closeToolModal();
                        openToolPanel();
                    }
                    e.stopPropagation();
                });
            }

            queueMicrotask(() => {
                const hasSelection = paper.project && paper?.project?.selectedItems.length > 0;
                panelBtn.children[0].children[0].src = getButtonURI("panel");
                panelBtn.children[0].setAttribute("style", `opacity: ${hasSelection ? 1 : .5}; cursor: pointer;`);
                if (!hasSelection) closeToolModal();
                else if (updatesAllowed) updateToolValues();
            });
        });
    }

    if (typeof scaffolding === "undefined") startListenerWorker();
}
