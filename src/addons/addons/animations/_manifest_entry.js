const manifest = {
  "name": "Reactive",
  "description": "Adds animations and reactiveness to parts of the editor. (formerly Animation Types)",
  "credits": [
    {
      "name": "Reflow"
    }
  ],
  "userscripts": [
    {
      "url": "userscript.js"
    }
  ],
  "info": [
    {
      "text": "If you enabled a reduced motion setting on your device, these settings will not apply. See how to re-enable motion: https://mgik.dev/turn-on-motion",
      "id": "reduced-motion"
    }
  ],
  "settings": [
     {
      "dynamic": true,
      "name": "Intensity",
      "id": "intensity",
      "type": "select",
      "potentialValues": [
        {
          "id": "default",
          "name": "Moderate animations"
        },
        {
          "id": "intense",
          "name": "Shower me in animations"
        }
      ],
      "default": "default"
    }
  ],
  "tags": ["editor", "new"],
  "enabledByDefault": true,
  "dynamicDisable": true
};
export default manifest;
