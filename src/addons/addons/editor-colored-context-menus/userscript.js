import { removeAlpha } from "../../libraries/common/cs/text-color.esm.js";

export default async function ({ addon, console }) {
  const ScratchBlocks = await addon.tab.traps.getBlockly();

  const fixupColor = (color) => {
    // some extensions have SVG-gradient styled blocks
    if (color.startsWith(`url(#`)) {
      const gradientID = color.substring(5, color.length - 1);
      const gradientCode = document.querySelector(`svg [id="${gradientID}"]`);
      if (!gradientCode || gradientCode.tagName !== "linearGradient") return "#000000";

      const parseCoord = v => parseFloat(v.replace("%", ""));
      const x1 = parseCoord(gradientCode.getAttribute("x1") || "0");
      const y1 = parseCoord(gradientCode.getAttribute("y1") || "0");
      const x2 = parseCoord(gradientCode.getAttribute("x2") || "100");
      const y2 = parseCoord(gradientCode.getAttribute("y2") || "0");

      const dx = x2 - x1, dy = y2 - y1;
      const angleDeg = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;

      const stops = Array.from(gradientCode.querySelectorAll("stop")).map(stop => {
        const color = stop.getAttribute("stop-color") || "#000";
        let offset = stop.getAttribute("offset");
        if (!offset) offset = "0%";
        else if (!offset.endsWith("%")) offset = parseFloat(offset) * 100 + "%";
        return `${color} ${offset}`;
      });
      return `linear-gradient(${angleDeg.toFixed(2)}deg, ${stops.join(", ")})`;
    } else {
      return removeAlpha(color);
    }
  };

  const applyContextMenuColor = (block) => {
    const widgetDiv = ScratchBlocks.WidgetDiv.DIV;
    if (!widgetDiv) {
      return;
    }
    const background = block.svgPath_;
    if (!background) {
      return;
    }
    const fill = fixupColor(background.getAttribute("fill"));
    const border = background.getAttribute("stroke") || "#0003";
    widgetDiv.classList.add("sa-contextmenu-colored");
    widgetDiv.style.setProperty("--sa-contextmenu-bg", fill);
    widgetDiv.style.setProperty("--sa-contextmenu-border", border);
    widgetDiv.style.setProperty("--sa-contextmenu-text", block.textColour ?? "#fff");
  };

  const originalHandleRightClick = ScratchBlocks.Gesture.prototype.handleRightClick;
  ScratchBlocks.Gesture.prototype.handleRightClick = function (...args) {
    const block = this.targetBlock_;
    const ret = originalHandleRightClick.call(this, ...args);
    if (block) {
      applyContextMenuColor(block);
    }
    return ret;
  };

  const originalHide = ScratchBlocks.WidgetDiv.hide;
  ScratchBlocks.WidgetDiv.hide = function (...args) {
    if (ScratchBlocks.WidgetDiv.DIV) {
      ScratchBlocks.WidgetDiv.DIV.classList.remove("sa-contextmenu-colored");
    }
    return originalHide.call(this, ...args);
  };
}
