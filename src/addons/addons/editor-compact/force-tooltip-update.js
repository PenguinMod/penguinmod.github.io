import EventTarget from "../../event-target.js"; /* inserted by pull.js */

export const eventTarget = new EventTarget();

export function updateTooltips() {
  eventTarget.dispatchEvent(new CustomEvent("update"));
}
