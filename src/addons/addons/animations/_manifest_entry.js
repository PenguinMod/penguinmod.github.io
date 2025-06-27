const manifest = {
  "name": "Animation Types",
  "description": "Change the intensity of animations that appear in the editor. Some moderate animations come with the editor by default.",
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
      "text": "If you enabled a reduced motion setting on your device, these settings will not apply.",
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
          "id": "none",
          "name": "No animations"
        },
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
