import _js from "./userscript.js";
import _css from "!css-loader!./userstyle.css";
import _asset from "!url-loader!./icons/infinite.svg";

export const resources = {
    "userscript.js": _js,
    "userstyle.css": _css,
    "icons/infinite.svg": _asset,
};