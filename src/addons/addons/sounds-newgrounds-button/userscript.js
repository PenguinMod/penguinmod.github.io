// Newgrounds Audio Button
// By: SharkPool
// Thanks Tom Fulp! :)

export default async function() {
  const ngIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0yLjUgLTIuNSAyNSAyNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJNNy4wNjkgMS43NzhhMi4wMiAyLjAyIDAgMCAxIDIuMDIgMi4wMnYxMy44MDZhLjg0Ljg0IDAgMCAxLS44NDIuODRINi4zOTZhLjg0Ljg0IDAgMCAxLS44NDItLjg0MlY2LjExOWEuODQuODQgMCAwIDAtLjg0Mi0uODQyaC0uMzM3YS44NC44NCAwIDAgMC0uODQxLjg0MnYxMS40ODRhLjg0Ljg0IDAgMCAxLS44NDEuODQxSC44NDJBLjg0Ljg0IDAgMCAxIDAgMTcuNjAzVjIuNjE5YS44NC44NCAwIDAgMSAuODQyLS44NDF6bTEwLjkxMiAwQTIuMDIgMi4wMiAwIDAgMSAyMCAzLjc5N3YzLjQ3NGEuNjczLjY3MyAwIDAgMS0uNjczLjY3M2gtMi4zNTZhLjY3My42NzMgMCAwIDEtLjY3My0uNjczVjUuNzgzYS41MDQuNTA0IDAgMCAwLS41MDUtLjUwNWgtLjg0MmEuNTA0LjUwNCAwIDAgMC0uNTA1LjUwNXY4LjY1OGMwIC4xODYuMTUxLjMzNy4zMzcuMzM3aDEuMzQ2YS4zMzYuMzM2IDAgMCAwIC4zMzYtLjMzN3YtMS42NjNoLS4zMzZhLjY3My42NzMgMCAwIDEtLjY3My0uNjczVjkuOTUyYS42NzMuNjczIDAgMCAxIC42NzMtLjY3M2gzLjE5OGEuNjczLjY3MyAwIDAgMSAuNjczLjY3MnY2LjQ3NGEyLjAyIDIuMDIgMCAwIDEtMi4wMiAyLjAxOWgtNS4wNDlhMi4wMiAyLjAyIDAgMCAxLTIuMDItMi4wMlYzLjc5N2EyLjAyIDIuMDIgMCAwIDEgMi4wMi0yLjAxOWg1LjA0OVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
  const safeIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAuNzc0IiBoZWlnaHQ9IjEwNS45MDUiIHZpZXdCb3g9IjAgMCAxMjAuNzc0IDEwNS45MDUiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iMjM5Ljg2IiB5MT0iMTMwLjA2IiB4Mj0iMjM5Ljg2IiB5Mj0iMjMyLjQ2NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMGZjMWQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMGI0MTYiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMjM5Ljg2IiB5MT0iMTMwLjA2IiB4Mj0iMjM5Ljg2IiB5Mj0iMjMyLjQ2NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJiIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMGFlMTQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZkMGQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJtMjAwLjMgMTc0LjEwOCAyMi40NDYgMjAuNDgxIDU0LjcwOS02NC41MjkgMjEuMDQyIDE3LjM5NS03Mi45NDYgODUuMDEtNDQuMzI5LTM4Ljk5OHoiIGZpbGw9InVybCgjYSkiIHN0cm9rZT0idXJsKCNiKSIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc5LjQ3MiAtMTI4LjMxKSIvPjwvc3ZnPg==";
  const warnIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjMuODYxIiBoZWlnaHQ9IjEwMC4yOTQiIHZpZXdCb3g9IjAgMCAxMjMuODYxIDEwMC4yOTQiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iMjQwIiB5MT0iMTMwLjM0MSIgeDI9IjI0MCIgeTI9IjIyNy4xMzQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iYSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZlYzEwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZhYzBjIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjI0MCIgeTE9IjEzMC4zNDEiIHgyPSIyNDAiIHkyPSIyMjcuMTM0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzhiNGUwMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzgyMjcwMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIyNDAiIHkxPSIxNTAuODkyIiB4Mj0iMjQwIiB5Mj0iMjIxLjQ1MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4OTQ1MDEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4MjI5MDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJtMjQwIDEzMC4zNCA2MC4xOCA5Ni43OTRIMTc5LjgyeiIgZmlsbD0idXJsKCNhKSIgc3Ryb2tlPSJ1cmwoI2IpIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc4LjA3IC0xMjguNTkpIi8+PHBhdGggZD0iTTIzMi41NjUgMjE0LjAxOGE3LjQzNSA3LjQzNSAwIDEgMSAxNC44NyAwIDcuNDM1IDcuNDM1IDAgMCAxLTE0Ljg3IDBtNy4xMjItMTIuOTA2YTYgNiAwIDAgMS02LTZ2LTM4LjIyYTYgNiAwIDAgMSA2LTZoLjYyNmE2IDYgMCAwIDEgNiA2djM4LjIyYTYgNiAwIDAgMS02IDZ6IiBmaWxsPSJ1cmwoI2MpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc4LjA3IC0xMjguNTkpIi8+PC9nPjwvc3ZnPg==";
  const unsafeIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjUuNTc4IiBoZWlnaHQ9IjEyNS44ODMiIHZpZXdCb3g9IjAgMCAxMjUuNTc4IDEyNS44ODMiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iMjM5Ljg2IiB5MT0iMTE5LjY3OSIgeDI9IjIzOS44NiIgeTI9IjI0MC42MDEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iYSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmUwMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOWIwMDA3Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjIzOS44NiIgeTE9IjExOS42NzkiIHgyPSIyMzkuODYiIHkyPSIyNDAuNjAxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzdlMDAyNyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzNiMDAwMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Im0xOTcuMjE0IDEyMC44MDIgNDIuNjQ2IDQxLjgwMyA0MS41MjMtNDIuOTI2IDE3Ljk1NiAxNy42NzYtNDEuNTIzIDQyLjM2NCA0Mi4zNjQgNDAuOTYyLTE3LjM5NCAxOC41MTctNDIuMDg1LTQxLjI0MkwxOTkuNDYgMjQwLjZsLTE4LjIzNy0xNy42NzVMMjIyLjE4NCAxODBsLTQyLjY0NS00MC45NjJ6IiBmaWxsPSJ1cmwoI2EpIiBzdHJva2U9InVybCgjYikiIHN0cm9rZS13aWR0aD0iMy41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3Ny4wNTkgLTExNy4xOTQpIi8+PC9zdmc+";

  const proxy1 = "https://corsproxy.io?url=";
  const proxy2 = "https://api.codetabs.com/v1/proxy?quest=";

  let ngButtonElement;

  async function safeFetch(url, respondType) {
    const proxies = [proxy1, proxy2];
    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy + url);

        if (response.ok) return await response[respondType]();
        if (response.status === 400) return undefined;
        continue;
      } catch (e) {
        console.warn(`Failed to fetch ${url} with proxy: ${proxy}`, e);
      }
    }
    return undefined;
  }

  async function addTrack2Editor(url, name) {
    const buffer = await safeFetch(url, "arrayBuffer");
    if (!buffer) {
      alert("Failed to Fetch Song!");
      return;
    }

    const storage = vm.runtime.storage;
    const asset = storage.createAsset(
      storage.AssetType.Sound, storage.DataFormat.MP3,
      new Uint8Array(buffer), null, true
    );

    try {
      await vm.addSound(
        {
          asset, name,
          md5: asset.assetId + "." + asset.dataFormat,
        },
        vm.editingTarget.id
      );
    } catch (e) {
      console.warn(e);
    }
  }

  async function openNewgroundsPopup() {
    let url, name, author, songURL;
    let infoBox = undefined;

    /* ScratchBlocks is availiable when this is called */
    const modal = await ScratchBlocks.customPrompt(
      { title: "Newgrounds Audio" }, { content: { width: "500px" } },
      [
        {
          name: "Add Track", role: "ok", callback: () => {
            if (url && name && songURL) addTrack2Editor(songURL, `${name} -- ${author}`);
          }
        },
        { name: "Cancel", role: "close", callback: () => {} }
      ]
    );

    const okayButton = modal.parentNode.querySelector(`button[class^="prompt_ok-button"]`);
    okayButton.style.filter = "brightness(70%)";
    okayButton.style.pointerEvents = "none";

    const label = document.createElement("div");
    label.innerHTML = `Import <a href="https://www.newgrounds.com/audio" target="_blank">Newgrounds</a> audio directly into your Project.<br><b>Not all tracks are fully free-to-use, read the report after searching.</b>`;
    label.setAttribute("style", "text-align: center; font-size: .85rem;");

    const idInputDiv = document.createElement("div");
    idInputDiv.setAttribute("style", "width: 100%; margin: 15px 0; padding: 10px 20px; border-radius: 15px; border: dashed 2px grey; text-align: center; font-size: .85rem;");

    const idLabel = document.createElement("b");
    idLabel.textContent = "Track ID/URL: ";
    const idInput = document.createElement("input");

    idInput.setAttribute("style", "margin-left: 5px; width: 70%; height: 25px; text-align: center; background: #ffffff20; border-radius: 15px; border: solid grey 1px;");
    idInput.type = "text";
    idInput.placeholder = "https://www.newgrounds.com/audio/listen/1395716";
    idInput.value = "1395716";
    url = idInput.placeholder;
    idInput.addEventListener("change", (e) => {
      url = String(e.target.value);
      if (!url.startsWith("https://www.newgrounds.com/audio/listen/")) url = "https://www.newgrounds.com/audio/listen/" + url;
      e.stopPropagation();
    });

    const searchBtn = document.createElement("button");
    searchBtn.setAttribute("style", "border: none; border-radius: 5px; padding: 10px 20px; margin: 10px 0 0; background: hsla(194, 100%, 50%, 1); cursor: pointer; font-weight: 600; font-size: 0.85rem; color: white;");
    searchBtn.textContent = "Search";
    searchBtn.addEventListener("click", async (e) => {
      // unfortunately we have to scrape html here since the Newgrounds API is hidden
      const htmlText = await safeFetch(url, "text");
      if (!htmlText) {
        alert("Failed to Fetch Track URL!");
        return;
      }

      /* extract info */
      author = htmlText.match(/"artist":"([^"]+)"/)?.[1] || "";
      name = htmlText.match(/<title>(.*?)<\/title>/i)?.[1] || "";

      let songMatch = htmlText.match(
        /<meta property="og:audio" content="(https:\/\/audio\.ngfiles\.com\/[^"]+\.mp3\?[^"]+)">/
      );
      if (!songMatch) {
        const regex = new RegExp(
          `"params":\\{"filename":"(https:\\/\\/audio\\.ngfiles\\.com\\/[^"]+\\.mp3\\?[^"]+)"}`
        );
        songMatch = htmlText.match(regex);
      };
      songURL = songMatch ? songMatch[1].replace(/\\/g, "") : "";

      /* song usage */
      // fun fact: we can check if a user is scouted if 'downloads' shows in their song!
      const isScouted = htmlText.match(/<dt>\s*Listens\s*<\/dt>[\s\S]*?<dd>\d+<\/dd>[\s\S]*?<dt>\s*Downloads\s*<\/dt>[\s\S]*?<dd>(\d+)<\/dd>[\s\S]*?<dt>\s*Score\s*<\/dt>/i);
      const ccLicense = htmlText.match(/<div class="pod-body creative-commons">[\s\S]*?<p>\s*([\s\S]*?)\s*<\/p>/i)?.[1] || "";
      const type = isScouted ? ccLicense2Rating(ccLicense) : "unwhitelisted";

      if (infoBox) infoBox.remove();
      infoBox = genCopyrightInfoBox(type, name, author);
      if (type === "bad" || type === "unwhitelisted") {
        name = undefined;
        okayButton.style.filter = "brightness(70%)";
        okayButton.style.pointerEvents = "none";
      } else {
        okayButton.style.filter = "";
        okayButton.style.pointerEvents = "";
      }
      modal.appendChild(infoBox);
      e.stopPropagation();
    });

    idInputDiv.append(idLabel, idInput, searchBtn);
    modal.append(label, idInputDiv);
  }

  function ccLicense2Rating(licence) {
    licence = String(licence).toLowerCase().trim();
    const goodTexts = [
      `you may only use this piece for commercial purposes if your work is a web-based game or animation,`,
    ];
    for (const text of goodTexts) {
      if (licence.startsWith(text)) return "good";
    }

    const badTexts = [
      `you may not use this work for any purposes`,
    ];
    for (const text of badTexts) {
      if (licence.startsWith(text)) return "bad";
    }

    const warnTexts = [
      `you are free to copy, distribute and transmit this work under the following conditions:`,
      `please contact me if you would like to use this in a project. we can discuss the details.`,
    ];
    for (const text of warnTexts) {
      if (licence.startsWith(text)) return "warn";
    }
    return "warn"; // warn is the default
  }

  function genCopyrightInfoBox(type, name, author) {
    const color = type === "good" ? "#00ff00" : type === "bad" || type === "unwhitelisted" ? "#ff0000" : "#ffc400";
    const box = document.createElement("div");
    box.setAttribute("style", `display: flex; width: 100%; margin: 15px 0; padding: 10px 20px 10px 30px; border-radius: 15px; border: solid 2px ${color}; background: ${color}30; text-align: center; font-size: .9rem; font-weight: bold;`);

    const img = document.createElement("img");
    img.setAttribute("style", "width:35px; margin-right: 5px;");
    img.src = type === "good" ? safeIcon : type === "bad" || type === "unwhitelisted" ? unsafeIcon : warnIcon;

    const label = document.createElement("span");
    if (type === "good") label.innerHTML = `The Track: ${name} by ${author}, can freely be used for web-based games`;
    else if (type === "bad") label.innerHTML = `The Track: ${name} by ${author}, is not allowed for use!`;
    else if (type === "unwhitelisted") label.innerHTML = `The Track: ${name} by ${author}, is not allowed for use. ${author} is not scouted on Newgrounds!`;
    else label.innerHTML = `The Track: ${name} by ${author}, can only be used for non-profit web-based games WITH credit. Further use requires permission from ${author}`;

    box.append(img, label);
    return box;
  }

  function addButtonNG() {
    // TODO add a tooltip maybe
    const itemDiv = document.querySelector(`div[class^="action-menu_menu-container"] div[class^="action-menu_more-buttons-outer"] div[class^="action-menu_more-buttons"]`);

    ngButtonElement = itemDiv.children[0].cloneNode(true);
    const innerButton = ngButtonElement.firstChild;
    innerButton.setAttribute("data-tip", "Newgrounds Sound");
    innerButton.setAttribute("aria-label", "Newgrounds Sound");
    /* cleanup */
    for (var i = 1; i < innerButton.children.length; i++) {
      const child = innerButton.children[i];
      if (child) child.remove();
    }
    innerButton.firstChild.src = ngIcon;
    ngButtonElement.addEventListener("click", openNewgroundsPopup);
    itemDiv.insertBefore(ngButtonElement, itemDiv.children[0]);
  }

  function startListenerWorker() {
    ReduxStore.subscribe(() => queueMicrotask(() => {
      const reduxState = ReduxStore.getState().scratchGui;
      /* sound tab */
      if (!reduxState.mode.isPlayerOnly && reduxState.editorTab.activeTabIndex === 2) {
        if (!ngButtonElement) addButtonNG();
      } else {
        ngButtonElement = undefined;
      }
    }));
  }

  if (typeof scaffolding === "undefined") startListenerWorker();
}
