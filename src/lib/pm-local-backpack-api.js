import localforage from 'localforage';
import md5 from 'js-md5';
import { soundThumbnail } from './backpack/sound-payload';
import { arrayBufferToBase64, base64ToArrayBuffer } from './tw-base64-utils';
import uid from "./uid";
import TWLocalBackpackAPI from './tw-local-backpack-api';

// Special constants -- do not change without care.
const DATABASE_NAME = 'pm:PM_Backpack';
const DATABASE_PORTED_KEY = 'pm:PM_Backpack_ported';
const STORE_NAME = 'backpack';
const backpackStore = localforage.createInstance({
    name: DATABASE_NAME,
    storeName: STORE_NAME
});

// NOTE: TurboWarp uses number IDs which seem to be for sorting only? Every time an IndexedDB ID is converted to a backpack ID, it's turned back into a string
// As far as I am aware, the Scratch website uses UUIDs so it doesnt seem to be something meant to give parity with Scratch
// This makes me assume that something like the below ID system is fine, but there could be some current or future issues with turning these into uids
const timedId = () => `${Number.MAX_SAFE_INTEGER - Date.now()}_${uid()}`;

const shouldPortBackpackContents = async () => {
    // NOTE: For PM Port this function can probably just return false all the time
    const alreadyPorted = await localforage.getItem(DATABASE_PORTED_KEY);
    return alreadyPorted !== true;
};
const portBackpackContents = async () => {
    const oldBackpack = await TWLocalBackpackAPI.getBackpackContents({ limit: Number.MAX_SAFE_INTEGER, offset: 0 });
    for (const item of oldBackpack) {
        await saveTurboWarpBackpackObject(item);
    }
    await localforage.setItem(DATABASE_PORTED_KEY, true);
};

const getBackpackContents = async ({
    limit,
    offset
}) => {
    const items = [];
    let count = 0;

    await backpackStore.iterate((value, key) => {
        if (count >= offset && items.length < limit) {
            items.push(TWLocalBackpackAPI.idbItemToBackpackItem(value));
        }
        count++;

        if (items.length >= limit) return items;
    });

    items.sort((a, b) => b.dateSaved - a.dateSaved);
    return items;
};

const saveBackpackObject = async ({
    type,
    mime,
    name,
    body,
    thumbnail
}) => {
    const bodyData = base64ToArrayBuffer(body);
    const bodyMD5 = md5(bodyData);

    const id = timedId();
    const dateSaved = Date.now();
    const idbItem = {
        id,
        type,
        mime,
        name,
        bodyData,
        bodyMD5,
        thumbnailData: base64ToArrayBuffer(thumbnail),
        dateSaved,
    };
    await backpackStore.setItem(id, idbItem);
    return TWLocalBackpackAPI.idbItemToBackpackItem(idbItem);
};
const saveTurboWarpBackpackObject = async (item) => {
    const id = timedId(item.id);
    const dateSaved = Date.now();
    const idbItem = {
        id,
        type: item.type,
        mime: item.mime,
        name: item.name,
        bodyData: item.bodyData,
        bodyMD5: item.bodyMD5,
        thumbnailData: item.thumbnailData,
        dateSaved,
    };
    await backpackStore.setItem(id, idbItem);
    return TWLocalBackpackAPI.idbItemToBackpackItem(idbItem);
};

const deleteBackpackObject = async ({
    id
}) => {
    return await backpackStore.removeItem(id);
};

const updateBackpackObject = async ({
    id,
    name
}) => {
    const item = await backpackStore.getItem(id);
    if (!item) throw new Error("Item not found");

    const dateUpdated = Date.now();
    const newItem = {
        ...item,
        name: name,
        dateUpdated,
    };
    await backpackStore.setItem(id, newItem);
    return TWLocalBackpackAPI.idbItemToBackpackItem(newItem);
};

export default {
    shouldPortBackpackContents,
    portBackpackContents,
    getBackpackContents,
    saveBackpackObject,
    deleteBackpackObject,
    updateBackpackObject
};
