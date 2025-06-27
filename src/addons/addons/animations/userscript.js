export default async function ({ addon, console, msg }) {
  function applySettings() {
    ReduxStore.dispatch({
      type: 'scratch-gui/addon-util/SET_EDITOR_ANIM_PREF',
      animPref: addon.settings.get('intensity') || "default"
    });
  }
  function resetSettings() {
    ReduxStore.dispatch({
      type: 'scratch-gui/addon-util/SET_EDITOR_ANIM_PREF',
      animPref: "default"
    });
  }
  addon.self.addEventListener("reenabled", applySettings);
  addon.self.addEventListener("disabled", resetSettings);
  addon.settings.addEventListener("change", applySettings);
  applySettings();
}
