import localforage from 'localforage';
import md5 from 'js-md5';
import { soundThumbnail } from './backpack/sound-payload';
import { arrayBufferToBase64, base64ToArrayBuffer } from './tw-base64-utils';
import uid from "./uid";
import TWLocalBackpackAPI from './tw-local-backpack-api';

// Special constants -- do not change without care.
const DATABASE_NAME = 'pm:PM_Backpack';
const STORE_NAME = 'backpack';
const backpackStore = localforage.createInstance({
    name: DATABASE_NAME,
    storeName: STORE_NAME
});

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
    const id = uid();
    const idbItem = {
        id,
        type,
        mime,
        name,
        bodyData,
        bodyMD5,
        thumbnailData: base64ToArrayBuffer(thumbnail)
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

    const newItem = {
        ...item,
        name: name
    };
    await backpackStore.setItem(id, newItem);
    return TWLocalBackpackAPI.idbItemToBackpackItem(newItem);
};

export default {
    getBackpackContents,
    saveBackpackObject,
    deleteBackpackObject,
    updateBackpackObject
};
