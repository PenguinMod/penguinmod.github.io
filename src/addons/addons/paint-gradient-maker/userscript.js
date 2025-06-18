// Gradient Maker Addon
// By: SharkPool
export default async function () {
    const isPM = true;
    const customID = "custom-gradient-btn";
    const symbolTag = Symbol("custom-gradient-tag");
    const guiIMGS = {
        "select": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect stroke="#000" fill="#fff" x=".5" y=".5" width="19" height="19" rx="4" stroke-opacity=".15"/><path fill="red" d="M13.35 8.8h-2.4V6.4a1.2 1.2 90 0 0-2.4 0l.043 2.4H6.15a1.2 1.2 90 0 0 0 2.4l2.443-.043L8.55 13.6a1.2 1.2 90 0 0 2.4 0v-2.443l2.4.043a1.2 1.2 90 0 0 0-2.4"/></svg>`,
        "add": `<svg viewBox="2 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"></path></svg>`,
        "delete": `<svg viewBox="2 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M 18 10 h -4 H 6 a 2 2 0 0 0 0 4 L 18 14 a 2 2 0 0 0 0 -4"></path></svg>`,
    };

    const paperLinkModes = new Set([
        "TEXT", "OVAL", "RECT",
        ...(isPM ? ["ROUNDED_RECT", "TRIANGLE", "SUSSY", "ARROW"] : [])
    ]);

    let selectedClassName, unselectedClassName, customBtn;
    let observerUsed = false;
    let modalStorage = {};

    /* Internal Utils */
    function position2Angle(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return angle + 90;
    }

    function initGradSelectClasses(gradRow) {
        const classes = {};
        const children = Array.from(gradRow.children);
        for (const child of children) {
            const name = child.classList.toString();
            if (classes[name] === undefined) classes[name] = 1;
            else classes[name] = 0;
        }

        for (const [cls, count] of Object.entries(classes)) {
            if (count) selectedClassName = cls;
            else unselectedClassName = cls
        }
    }

    function encodeGradHTML(settings) {
        const sortedParts = [...settings.parts].sort((a, b) => a.p - b.p);

        let gradString = settings.type === "Linear" ? "linear-gradient(" : "radial-gradient(";
        if (settings.type === "Linear") gradString += `${settings.dir}deg, `;
        for (const part of sortedParts) gradString += `${part.c} ${part.p}%, `;
        return gradString.substring(0, gradString.length - 2) + ")";
    }

    function genLinearGradPoints(bounds, angleDeg) {
        const center = bounds.center;
        const dir = new paper.Point({ angle: angleDeg, length: 1 });
        const boundsRect = new paper.Path.Rectangle(bounds);
        const gradLine = new paper.Path.Line({
            from: center.subtract(dir.multiply(10000)),
            to: center.add(dir.multiply(10000))
        });

        const intersections = gradLine.getIntersections(boundsRect);
        gradLine.remove();
        boundsRect.remove();
        if (intersections.length < 2) {
            return {
                origin: center.subtract(dir.multiply(bounds.width / 2)),
                destination: center.add(dir.multiply(bounds.width / 2))
            };
        } else {
            return {
                origin: intersections[0].point,
                destination: intersections[1].point
            };
        }
    }

    function setSelected2Grad(settings) {
        // compile SVG-based gradient
        const sortedParts = [...settings.parts].sort((a, b) => a.p - b.p);
        const gradStops = sortedParts.map(part => new paper.GradientStop(part.c, part.p / 100));
        const gradient = new paper.Gradient(gradStops, settings.type === "Radial");
        modalStorage._gradCache = { settings, gradient };

        paper.project.getSelectedItems().forEach((item) => {
            let origin, destination;
            if (settings.type === "Radial") {
                origin = item.bounds.center;
                destination = item.bounds.center.add([item.bounds.width / 2, 0]);
            } else {
                const points = genLinearGradPoints(item.bounds, settings.dir - 90);
                origin = points.origin;
                destination = points.destination;
            }

            item[settings.path] = { gradient, origin, destination };
        });

        // update drawing & action
        if (paper.tool.onUpdateImage) paper.tool.onUpdateImage();

        // set with html otherwise GUI will crash
        const swatch = document.querySelectorAll(
            `div[class^=color-button_color-button_] div[class^=color-button_color-button-swatch_]`
        )[settings.path === "fillColor" ? 0 : 1];
        if (swatch) swatch.style.background = encodeGradHTML(settings);
    }

    function paperGrad2CSS(paperGrad) {
        const { gradient, origin, destination } = paperGrad;
        if (!gradient || !origin || !destination) return null;

        const stops = gradient.stops.map(s => `${s.color.toCSS(true)} ${Math.round(s.offset * 100)}%`);
        if (gradient.radial) return `radial-gradient(circle, ${stops.join(", ")})`;
        else return `linear-gradient(${position2Angle(destination, origin)}deg, ${stops.join(", ")})`;
    }

    function extractGradient(color) {
        if (!color || !color.gradient) return {};
        return {
            gradient: color.gradient,
            origin: color.origin || "",
            destination: color.destination || color.highlight || ""
        };
    }

    function decodeSelectedGrad(item, draggableDiv, settingsDiv) {
        const { gradient, origin, destination } = extractGradient(item[modalStorage.path]);
        if (!gradient || !origin || !destination) return draggableDiv.append(createDraggable(), createDraggable());

        // create draggables
        const newStops = gradient.stops.map((s, i) => {
            // "offset" will be undefined when using Scratch gradients, which dont have set-stops
            const alpha = Math.round(s.color.alpha * 255).toString(16).padStart(2, "0");
            return createDraggable(s.color.toCSS(true) + alpha, s.offset ? s.offset * 100 : i * 100)
        });
        draggableDiv.append(...newStops);

        // preset values
        const angle = position2Angle(destination, origin);
        settingsDiv.querySelector("select").value = gradient.radial ? "Radial" : "Linear";
        settingsDiv.querySelector("input").value = angle;
        modalStorage.type = gradient.radial ? "Radial" : "Linear";
        modalStorage.dir = angle;
    }

    function decodeFromCache(settings, draggableDiv, settingsDiv) {
        // create draggables
        const newStops = settings.parts.map((s, i) => {
            // "p" will be NaN when using Scratch gradients, which dont have set-stops
            return createDraggable(s.c, isNaN(s.p) ? i * 100 : s.p)
        });
        draggableDiv.append(...newStops);

        // preset values
        settingsDiv.querySelector("select").value = settings.type;
        settingsDiv.querySelector("input").value = settings.dir;
        modalStorage.type = settings.type;
        modalStorage.dir = settings.dir;
    }

    function handleFillEvent(paint) {
        if (!modalStorage._gradCache) return;

        // set the GUI gradient mode to linear so we can position our gradients
        paint.fillMode.gradientType = "HORIZONTAL";
        paint.color.fillColor.gradientType = "HORIZONTAL";
        paint.color.strokeColor.gradientType = "HORIZONTAL";

        // set the swatch color in case the GUI resets it
        const swatch = document.querySelector(`div[class^=color-button_color-button_] div[class^=color-button_color-button-swatch_]`);
        if (swatch) queueMicrotask(() => {
            if (!modalStorage._gradCache) return;
            swatch.style.background = encodeGradHTML(modalStorage._gradCache.settings);
        });

        const tool = paper.tool;
        if (typeof tool?._getFillItem !== "function") return;

        const item = tool._getFillItem();
        if (!item) return;

        const bounds = item.bounds;
        let origin, destination;
        if (modalStorage.type === "Radial") {
            origin = new paper.Point(tool._point.x, tool._point.y);
            destination = origin.add([Math.max(bounds.width, bounds.height) / 2, 0]);
        } else {
            const points = genLinearGradPoints(bounds, modalStorage.dir - 90);
            origin = points.origin;
            destination = points.destination;
        }

        const path = tool.fillProperty === "fill" ? "fillColor" : "strokeColor";
        item[path] = {
            gradient: modalStorage._gradCache.gradient,
            origin, destination
        };
    }

    function handleShapeModeEvent(type) {
        if (!modalStorage._gradCache && type !== "TEXT") return;

        // set the swatch color in case the GUI resets it
        const swatch = document.querySelector(`div[class^=color-button_color-button_] div[class^=color-button_color-button-swatch_]`);
        if (swatch) queueMicrotask(() => {
            if (!modalStorage._gradCache) return;
            swatch.style.background = encodeGradHTML(modalStorage._gradCache.settings);
        });

        const tool = paper.tool;
        if (typeof tool?._onMouseDrag !== "function") return;
        if (tool[symbolTag]) return;
        // patch this event, if not already, to run our code

        const funcName = type === "TEXT" ? "onKeyDown" : "onMouseDrag";
        const ogOnFunc = tool[funcName];
        tool[symbolTag] = true;
        tool[funcName] = function (...args) {
            ogOnFunc.call(this, ...args);

            // replace the fill with the custom gradient
            if (!modalStorage._gradCache) {
                if (type === "TEXT") {
                    tool.element.style.background = "";
                    tool.element.style.backgroundClip = "";
                    tool.element.style.color = "";
                }
                return;
            }

            let item;
            switch (type) {
                case "RECT":
                    item = this.rect;
                    break;
                case "OVAL":
                    item = this.oval;
                    break;
                case "TEXT":
                    item = this.textBox;
                    break;
                /* PenguinMod shapes */
                case "ROUNDED_RECT":
                    item = this.rect;
                    break;
                case "TRIANGLE":
                    item = this.tri;
                    break;
                case "SUSSY":
                    item = this.sussy;
                    break;
                case "ARROW":
                    item = this.tri;
                    break;
                default: return;
            }
            if (!item) return;
            const bounds = item.bounds;
            let origin, destination;
            if (modalStorage.type === "Radial") {
                origin = item.bounds.center;
                destination = item.bounds.center.add([item.bounds.width / 2, 0]);
            } else {
                const points = genLinearGradPoints(bounds, modalStorage.dir - 90);
                origin = points.origin;
                destination = points.destination;
            }

            item.fillColor = {
                gradient: modalStorage._gradCache.gradient,
                origin, destination
            };

            // text uses HTML elements, so we have to handle that too
            if (type === "TEXT") {
                tool.element.style.background = encodeGradHTML(modalStorage._gradCache.settings);
                tool.element.style.backgroundClip = "text";
                tool.element.style.color = "transparent";
            }
        }
    }

    /* GUI Utils */
    function getButtonURI(name, dontCompile) {
        const themeHex = isPM ? "#00c3ff" : document.documentElement.style.getPropertyValue("--looks-secondary") || "#ff4c4c";
        const guiSVG = guiIMGS[name].replace("red", themeHex);
        if (dontCompile) return guiSVG;
        else return "data:image/svg+xml;base64," + btoa(guiSVG);
    }

    function showSelectedGrad(item) {
        const [fillSwatch, outlineSwatch] = document.querySelectorAll(`div[class^=color-button_color-button_] div[class^=color-button_color-button-swatch_]`);
        const outCSSGrad = paperGrad2CSS(extractGradient(item.strokeColor));
        if (outlineSwatch) {
            if (outCSSGrad) outlineSwatch.style.background = outCSSGrad;
            else if (!item.strokeColor || item.strokeWidth === 0) outlineSwatch.style.background = "#fff";
        }

        const fillGrad = extractGradient(item.fillColor);
        const fillCSSGrad = paperGrad2CSS(fillGrad);
        modalStorage._gradCache = undefined;
        if (fillSwatch) {
            if (fillCSSGrad) {
                fillSwatch.style.background = fillCSSGrad;

                // update cache
                const { gradient, destination, origin } = fillGrad;
                modalStorage._gradCache = {
                    gradient,
                    settings: {
                        type: gradient.radial ? "Radial" : "Linear",
                        dir: position2Angle(destination, origin),
                        parts: gradient.stops.map(s => {
                            const alpha = Math.round(s.color.alpha * 255).toString(16).padStart(2, "0");
                            return { c: s.color.toCSS(true) + alpha, p: s.offset * 100 };
                        })
                    }
                };
            } else if (!item.fillColor) fillSwatch.style.background = "#fff";
        }
    }

    function createDraggable(optC, optP) {
        const index = modalStorage.parts.length;
        const rngPos = optP ?? Math.floor(Math.random() * 100);
        const rngHex = optC ?? `#${Math.floor(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, "0")}`;
        const opacity = optC ? optC.length === 9 ? parseInt(optC.slice(7, 9), 16) / 255 : 1 : 1;
  
        const draggable = document.createElement("div");
        draggable.id = index;
        draggable.classList.add("pointer");
        draggable.setAttribute("style", `cursor: pointer; width: 25px; position: absolute; top: -6px; transform: translateX(-50%);`);
        draggable.style.left = `${rngPos}%`;

        const nub = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        nub.setAttribute("width", "14");
        nub.setAttribute("height", "7");
        nub.style.transform = "translateX(45%)";

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "0,7 7,0 14,7");
        polygon.setAttribute("stroke", "#fff");
        polygon.setAttribute("fill", "#fff");
        nub.appendChild(polygon);

        const color = document.createElement("div");
        color.setAttribute("style", `width: 25px; height: 25px; border-radius: 4px; background: #fff; display: flex; justify-content: center; align-items: center; flex-direction: column;`);

        const colorContainer = document.createElement("div");
        colorContainer.setAttribute("style", `width: 16px; height: 16px; border-radius: 5px; background: ${rngHex}; border: solid 2px rgba(0,0,0,.2); opacity: ${opacity}; margin-bottom: 2px;`);

        const colorInput = document.createElement("input");
        colorInput.setAttribute("type", "color");
        colorInput.setAttribute("style", `opacity: 0; position: absolute; pointer-events: none;`);

        const opacityInput = document.createElement("input");
        opacityInput.setAttribute("type", "number");
        opacityInput.setAttribute("min", "0");
        opacityInput.setAttribute("max", "100");
        opacityInput.value = opacity * 100;
        opacityInput.setAttribute("style", `visibility: hidden; background: #fff; border: none; color: #000; text-align: center; position: absolute; pointer-events: auto; width: 45px; height: 25px; padding: 0; margin: 0; border-radius: 0 5px 5px 0; left: 22px;`);

        // Color picker handler
        colorContainer.addEventListener("click", (e) => {
            opacityInput.style.visibility = "visible";
            colorInput.click();
            e.stopPropagation();
        });
        draggable.addEventListener("mouseleave", (e) => {
            opacityInput.style.visibility = "hidden";
            e.stopPropagation();
        });

        colorInput.addEventListener("input", (e) => {
            modalStorage.parts[index].c = e.target.value;
            colorContainer.style.background = e.target.value;
            updateDisplay();
        });

        // Opacity slider handler
        opacityInput.addEventListener("click", (e) => {
            opacityInput.focus();
            e.stopPropagation();
        });
        opacityInput.addEventListener("input", (e) => {
            const newOpacity = Math.min(100, Math.max(0, e.target.value));
            e.target.value = newOpacity;
            colorContainer.style.opacity = newOpacity / 100;

            const alpha = Math.round(newOpacity * 2.55).toString(16).padStart(2, "0");
            const hex = modalStorage.parts[index].c;
            modalStorage.parts[index].c = hex.substring(0, 7) + alpha;
            updateDisplay();
        });

        draggable.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (e.target === opacityInput) return;

            modalStorage.selectedPointer = draggable;
            const container = draggable.parentElement;
            const containerRect = container.getBoundingClientRect();

            const onMouseMove = (moveEvent) => {
                const x = moveEvent.clientX - containerRect.left;
                const percent = Math.min(100, Math.max(0, (x / container.offsetWidth) * 100));
                draggable.style.left = `${percent}%`;
                modalStorage.parts[index].p = percent;
                updateDisplay();
            };

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        color.append(colorContainer, colorInput, opacityInput);
        draggable.append(nub, color);
        modalStorage.parts.push({ c: rngHex, p: rngPos });
        modalStorage.selectedPointer = draggable;
        return draggable;
    }

    function genSettingsTable(div) {
        const btnStyle = `width: 35px; height: 35px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px; background: var(--paint-input-background, --ui-primary, #fff); transition: transform 0.2s;`;
        const selectStlye = `cursor: pointer; height: 30px; margin: 5px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px; background: var(--ui-secondary, #fff);`;
        const directionStyle = `text-align: center; width: 50px; height: 25px; margin: 5px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px; background: var(--ui-secondary, #fff);`;

        const createBtn = document.createElement("button");
        createBtn.setAttribute("style", btnStyle);
        createBtn.setAttribute("onmouseover", `this.style.transform="scale(1.1)"`);
        createBtn.setAttribute("onmouseout", `this.style.transform="scale(1)"`);
        createBtn.innerHTML = getButtonURI("add", true);
        createBtn.addEventListener("click", (e) => {
            const draggableSpace = modalStorage.modal.querySelector(`div[class="draggables"]`);
            draggableSpace.appendChild(createDraggable());
            updateDisplay();
            e.stopPropagation();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("style", btnStyle);
        deleteBtn.setAttribute("onmouseover", `this.style.transform="scale(1.1)"`);
        deleteBtn.setAttribute("onmouseout", `this.style.transform="scale(1)"`);
        deleteBtn.style.margin = "0px 8px";
        deleteBtn.innerHTML = getButtonURI("delete", true);
        deleteBtn.addEventListener("click", (e) => {
            const pointer = modalStorage.selectedPointer;
            if (pointer) {
                modalStorage.parts.splice(pointer.id, 1);
                pointer.remove();
                updateDisplay();
                delete modalStorage.selectedPointer;
            }
            e.stopPropagation();
        });

        const title1 = document.createElement("span");
        title1.textContent = "Gradient Type:";

        const select = document.createElement("select");
        select.setAttribute("style", selectStlye);

        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.text = "Linear"; option1.value = "Linear";
        option2.text = "Radial"; option2.value = "Radial";
        select.append(option1, option2);
        select.addEventListener("change", (e) => {
            modalStorage.type = e.target.value;
            updateDisplay();
            e.stopPropagation();
        });

        const title2 = document.createElement("span");
        title2.textContent = "Direction:";

        const dirBtn = document.createElement("input");
        dirBtn.setAttribute("style", directionStyle);
        dirBtn.setAttribute("type", "number");
        dirBtn.setAttribute("max", 360);
        dirBtn.setAttribute("min", 0);
        dirBtn.setAttribute("value", 90);
        dirBtn.addEventListener("input", (e) => {
            modalStorage.dir = e.target.value;
            updateDisplay();
            e.stopPropagation();
        });

        div.append(createBtn, deleteBtn, title1, select, title2, dirBtn);
    }

    function genButtonTable(div) {
        const themeHex = isPM ? "#00c3ff" : document.documentElement.style.getPropertyValue("--looks-secondary") || "#ff4c4c";
        const btnStyle = `color: #fff; font-weight: 600; text-align: center; padding: 10px; margin: 10px 5px; border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px; background: ${themeHex}; transition: transform 0.2s;`;

        const enterBtn = document.createElement("button");
        enterBtn.id = "enter";
        enterBtn.setAttribute("style", btnStyle);
        enterBtn.setAttribute("onmouseover", `this.style.transform="scale(1.1)"`);
        enterBtn.setAttribute("onmouseout", `this.style.transform="scale(1)"`);
        enterBtn.textContent = "Okay";

        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancel";
        cancelBtn.setAttribute("style", btnStyle);
        cancelBtn.setAttribute("onmouseover", `this.style.transform="scale(1.1)"`);
        cancelBtn.setAttribute("onmouseout", `this.style.transform="scale(1)"`);
        cancelBtn.textContent = "Cancel";

        div.append(cancelBtn, enterBtn);
    }

    function updateDisplay() {
        const display = modalStorage.modal.querySelector(`div[class="color-display"]`);
        display.style.background = encodeGradHTML(modalStorage);
    }

    /* Main GUI */
    function openGradientMaker() {
        const paint = ReduxStore.getState().scratchPaint;
        const oldCache = modalStorage._gradCache;
        modalStorage = {
            parts: [], type: "Linear", dir: 90,
            selectedPointer: undefined, modal: undefined,
            path: paint.modals.fillColor ? "fillColor" : "strokeColor"
        };

        const container = document.createElement("div");
        container.classList.add("SP-gradient-maker");
        container.setAttribute("style", `position: absolute; z-index: 9999; pointer-events: auto; background-color: rgba(0,0,0,.1); width: 100%; height: 100vh;`);

        const modal = document.createElement("div");
        modal.classList.add("gradient-modal");
        modal.setAttribute("style", `color: var(--paint-text-primary, #575e75); width: 450px; height: 260px; display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: var(--ui-secondary, hsla(215, 75%, 95%, 1)); border: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); border-radius: 5px; padding: 15px;`);
        modalStorage.modal = modal;

        const title = document.createElement("span");
        title.setAttribute("style", `display: block; text-align: center; justify-content: center; border-bottom: solid 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); padding-bottom: 10px; margin: 0 25px 0 25px; font-weight: 600;"`);
        title.textContent = "Gradient Maker";

        const display = document.createElement("div");
        display.classList.add("color-display");
        display.setAttribute("style", `width: 420px; height: 40px; display: flex; justify-content: center; align-items: center; margin: 15px 15px 0 15px; border: solid 2px grey; border-radius: 5px 5px 0 0;`);

        const draggables = document.createElement("div");
        draggables.classList.add("draggables");
        draggables.setAttribute("style", `width: 420px; height: 40px; position: relative; display: flex; justify-content: center; align-items: center; margin: 0 15px 15px 15px; border: solid 2px grey; border-radius: 0 0 5px 5px; background: #111111;`);

        const settings = document.createElement("div");
        settings.classList.add("settings");
        settings.setAttribute("style", `border-top: dashed 2px var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15)); padding-top: 10px; display: flex; justify-content: center; align-items: center;`);
        genSettingsTable(settings);

        const buttons = document.createElement("div");
        buttons.setAttribute("style", `display: flex; justify-content: center; align-items: center;`);
        genButtonTable(buttons);
        buttons.addEventListener("click", (e) => {
            if (e.target.id) {
                if (e.target.id === "enter") setSelected2Grad(modalStorage);
                container.remove();
            }
            e.stopPropagation();
        });

        modal.append(title, display, draggables, settings, buttons);
        container.appendChild(modal);
        document.body.appendChild(container);

        if (paint.selectedItems?.length) decodeSelectedGrad(paint.selectedItems[0], draggables, settings);
        else if (oldCache) decodeFromCache(oldCache.settings, draggables, settings);
        else draggables.append(createDraggable(), createDraggable());
        updateDisplay();
    }

    function startListenerWorker() {
        let lastMode, lastSelected, lastModals;
        ReduxStore.subscribe(() => {
            const paint = ReduxStore.getState().scratchPaint;
            if (!paint || paint?.format === undefined || paint?.format === null) return;
            const { mode, selectedItems, modals } = paint;

            // no bitmap support :(
            if (paint.format.startsWith("BITMAP")) {
                if (customBtn) {
                    customBtn.remove();
                    customBtn = undefined;
                }
                return;
            }

            // run relative tool events
            if (mode === "FILL") handleFillEvent(paint);
            else if (paperLinkModes.has(mode)) handleShapeModeEvent(mode);

            const idChain = selectedItems.map((e) => e.id).join(".");
            const modalChain = `${modals.fillColor}${modals.strokeColor}`;
            if (mode === lastMode && idChain === lastSelected && modalChain === lastModals) return;
            lastMode = mode;
            lastSelected = idChain;
            lastModals = modalChain;

            // decode potential custom gradients
            if (selectedItems?.length) showSelectedGrad(selectedItems[0]);
            else if (mode === "SELECT" || mode === "RESHAPE") modalStorage._gradCache = undefined;

            // add custom modal
            if (!modals.strokeColor && !modals.fillColor) return;
            if (observerUsed) return;
            const observer = new MutationObserver(() => {
                const gradRow = document.querySelector(`div[class^="color-picker_gradient-picker-row_"]`);
                if (!gradRow || gradRow.lastElementChild.id === customID) return;

                // get the appropriate class names for selected items
                if (!selectedClassName) initGradSelectClasses(gradRow);
                const children = Array.from(gradRow.children);

                customBtn = children[0].cloneNode(true);
                customBtn.src = getButtonURI("select");
                customBtn.id = customID;
                customBtn.setAttribute("class", unselectedClassName);
                gradRow.appendChild(customBtn);

                gradRow.addEventListener("click", (e) => {
                    if (e.target === customBtn) {
                        for (const child of children) child.setAttribute("class", unselectedClassName);
                        customBtn.setAttribute("class", selectedClassName);
                        openGradientMaker();
                    } else if (e.target.nodeName === "IMG") {
                        modalStorage._gradCache = undefined;
                        customBtn.setAttribute("class", unselectedClassName);
                    }
                });

                observerUsed = false;
                observer.disconnect();
            });

            observer.observe(document.body, { childList: true, subtree: true });
            observerUsed = true;
        });
    }

    if (typeof scaffolding === "undefined") startListenerWorker();
}
