export default async function ({ addon, console, msg }) {
  function applySettings() {
    ReduxStore.dispatch({
      type: 'scratch-gui/addon-util/SET_REACTIVE_SETTINGS',
      animPref: addon.settings.get('intensity') || "none",
      deleteAnim: addon.settings.get('deleteAnim') || "shrink",
    });
  }
  function resetSettings() {
    ReduxStore.dispatch({
      type: 'scratch-gui/addon-util/SET_REACTIVE_SETTINGS',
      animPref: "none",
      deleteAnim: "shrink",
    });
  }
  addon.self.addEventListener("reenabled", applySettings);
  addon.self.addEventListener("disabled", resetSettings);
  addon.settings.addEventListener("change", applySettings);
  applySettings();
}
