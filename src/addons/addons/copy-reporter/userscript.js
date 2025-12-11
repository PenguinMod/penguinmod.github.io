export default async function ({ addon, console, msg }) {
  addon.tab.createEditorContextMenu(
    (ctx) => {
      const className = ctx.type === "monitor_large" ? "monitor_large-value" : "monitor_value";
      const element = ctx.target.querySelector(`[class*='${className}_']`);

      if (element.innerText.length !== 0) {
        navigator.clipboard.writeText(element.innerText);
      }
    },
    {
      className: "copy",
      types: ["monitor_default", "monitor_large", "monitor_slider"],
      position: "monitor",
      order: 0,
      label: msg("copy-value"),
    }
  );

  // add button to reporter bubble
  const ScratchBlocks = await addon.tab.traps.getBlockly();

  // https://github.com/PenguinMod/PenguinMod-Blocks/blob/develop/core/workspace_svg.js#L1017C1
  ScratchBlocks.WorkspaceSvg.prototype.reportValue = function(id, value, isError) {
    var block = this.getBlockById(id);
    if (!block) {
      throw 'Tried to report value on block that does not exist.';
    }
    ScratchBlocks.DropDownDiv.hideWithoutAnimation();
    ScratchBlocks.DropDownDiv.clearContent();
    var contentDiv = ScratchBlocks.DropDownDiv.getContentDiv();

    var valueReportBox = ScratchBlocks.goog.dom.createElement('div');
    valueReportBox.setAttribute('class', 'valueReportBox');
    if (typeof value !== 'object' || value === null || typeof value.toReporterContent !== 'function') {
      valueReportBox.textContent = String(value);
    } else {
      valueReportBox.appendChild(value.toReporterContent());
    }

    if (!addon.self.disabled) {
      // use to get focus and event priority
      valueReportBox.setAttribute("tabindex", "0");
      // if the user pressed Ctrl+C, prevent propagation to Blockly
      valueReportBox.onkeydown = (event) => {
        if ((event.altKey || event.ctrlKey || event.metaKey) && event.code === "KeyC") {
          event.stopPropagation();
        }
      };

      if (value.length !== 0) {
        const copyButton = document.createElement("img");
        copyButton.setAttribute("role", "button");
        copyButton.setAttribute("tabindex", "0");
        copyButton.setAttribute("alt", msg("copy-to-clipboard"));
        copyButton.setAttribute("src", addon.self.getResource("/copy.svg")) /* rewritten by pull.js */;

        copyButton.classList.add("sa-copy-reporter-icon");
        addon.tab.displayNoneWhileDisabled(copyButton);

        copyButton.onclick = () => navigator.clipboard.writeText(value);
        valueReportBox.appendChild(copyButton);
      }
    }

    contentDiv.appendChild(valueReportBox);
    ScratchBlocks.DropDownDiv.setColour(
      ScratchBlocks.Colours.valueReportBackground,
      isError 
        ? ScratchBlocks.Colours.blockError 
        : ScratchBlocks.Colours.valueReportBorder
    );
    ScratchBlocks.DropDownDiv.showPositionedByBlock(this, block);
  };
}
