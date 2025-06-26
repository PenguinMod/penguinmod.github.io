const manifest = {
  "name": "Reactive: Animations",
  "description": "Adds animations to parts of the editor. Some parts of Reactive come with the editor and are not controlled here. These settings control animations and vigorous movement only. (formerly Animation Types)",
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
  "userstyles": [
    {
      "url": "style.css"
    }
  ],
  "info": [
    {
      "text": "If you enabled a reduced motion setting on your device, these settings will not apply. See how to re-enable motion: https://mgik.dev/turn-on-motion",
      "id": "reduced-motion"
    },
    {
      "text": "Reactive is experimental. If anything stops working because of it (I'm sure there will be a few things), create an issue on the Github and mention me (@mmmmaaaaarrrrrrkkkkkkkk), and I will do my best to make a fix.",
      "id": "experimental"
    }
  ],
  "settings": [
     {
      "dynamic": true,
      "name": "Animation Intensity",
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
    },
    {
      "dynamic": true,
      "name": "Sprite/Costume/Sound Deletion Animation",
      "id": "deleteAnim",
      "type": "select",
      "potentialValues": [
        {
          "id": "shrink",
          "name": "Shrink to nothing"
        },
        {
          "id": "fly",
          "name": "Fly out"
        }
      ],
      "default": "shrink"
    }
  ],
  "tags": ["editor", "new"],
  "enabledByDefault": true,
  "dynamicDisable": true
};
export default manifest;
