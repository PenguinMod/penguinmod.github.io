import localforage from 'localforage';
import md5 from 'js-md5';
import { idbItemToBackpackItem } from './tw-local-backpack-api';

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
    throw new Error("Not implemented");
};

const saveBackpackObject = async ({
    type,
    mime,
    name,
    body,
    thumbnail
}) => {
    throw new Error("Not implemented");
};

const deleteBackpackObject = async ({
    id
}) => {
    throw new Error("Not implemented");
};

const updateBackpackObject = async ({
    id,
    name
}) => {
    throw new Error("Not implemented");
};

export default {
    getBackpackContents,
    saveBackpackObject,
    deleteBackpackObject,
    updateBackpackObject
};
