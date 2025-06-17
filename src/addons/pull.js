/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable import/no-commonjs */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */
/* global __dirname */

const fs = require('fs');
const childProcess = require('child_process');
const rimraf = require('rimraf');
const pathUtil = require('path');
let {addons, newAddons} = require('./addons.js');

const walk = dir => {
    const children = fs.readdirSync(dir);
    const files = [];
    for (const child of children) {
        const path = pathUtil.join(dir, child);
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
            const childChildren = walk(path);
            for (const childChild of childChildren) {
                files.push(pathUtil.join(child, childChild));
            }
        } else {
            files.push(child);
        }
    }
    return files;
};

const clone = obj => JSON.parse(JSON.stringify(obj));

const repoPath = pathUtil.resolve(__dirname, 'ScratchAddons');
if (!process.argv.includes('-')) {
    rimraf.sync(repoPath);
    childProcess.execSync(`git clone --depth=1 --branch=develop https://github.com/PenguinMod/PenguinMod-Addons ${repoPath}`);
}

for (const folder of ['addons', 'addons-l10n', 'addons-l10n-settings', 'libraries']) {
    const path = pathUtil.resolve(__dirname, folder);
    rimraf.sync(path);
    fs.mkdirSync(path, {recursive: true});
}

const generatedPath = pathUtil.resolve(__dirname, 'generated');
rimraf.sync(generatedPath);
fs.mkdirSync(generatedPath, {recursive: true});

process.chdir(repoPath);
const commitHash = childProcess.execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

class GeneratedImports {
    constructor () {
        this.source = '';
        this.namespaces = new Map();
    }

    add (src, namespace) {
        // On Windows, convert \ to / in paths.
        src = src.replace(/\\/g, '/');

        namespace = namespace.replace(/[^\w\d_]/g, '_');

        const count = this.namespaces.get(namespace) || 1;
        this.namespaces.set(namespace, count + 1);

        // All identifiers should start with _ so things like debugger and 2d-color-picker will be valid identifiers
        let importName = `_${namespace}`;
        if (count !== 1) {
            importName += `${count}`;
        }

        this.source += `import ${importName} from ${JSON.stringify(src)};\n`;
        return importName;
    }

    toString () {
        return this.source;
    }
}

const matchAll = (str, regex) => {
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(match);
    }
    return matches;
};

const includeImportedLibraries = contents => {
    // Parse things like:
    // import { normalizeHex, getHexRegex } from "../../libraries/normalize-color.js";
    // import RateLimiter from "../../libraries/rate-limiter.js";
    const matches = matchAll(
        contents,
        /import +(?:{.*}|.*) +from +["']\.\.\/\.\.\/libraries\/([\w\d_\/-]+(?:\.esm)?\.js)["'];/g
    );
    for (const match of matches) {
        const libraryFile = match[1];
        const oldLibraryPath = pathUtil.resolve(__dirname, 'ScratchAddons', 'libraries', libraryFile);
        const newLibraryPath = pathUtil.resolve(__dirname, 'libraries', libraryFile);
        const libraryContents = fs.readFileSync(oldLibraryPath, 'utf-8');
        const newLibraryDirName = pathUtil.dirname(newLibraryPath);
        fs.mkdirSync(newLibraryDirName, {
            recursive: true
        });
        fs.writeFileSync(newLibraryPath, libraryContents);
    }
};

const includePolyfills = contents => {
    if (contents.includes('EventTarget')) {
        contents = `import EventTarget from "../../event-target.js"; /* inserted by pull.js */\n\n${contents}`;
    }
    return contents;
};

const detectUnimplementedAPIs = (addonId, contents) => {
    if (contents.includes('data-addon-id')) {
        console.warn(`Warning: ${addonId} seems to use data-addon-id. It should use [data-addons*=...] instead.`);
    }

    if (contents.includes('addon.self.dir')) {
        // eslint-disable-next-line max-len
        console.warn(`Warning: ${addonId} contains unwritten addon.self.dir. It or this script should be modified so that it will be rewritten.`);
    }

    if (contents.includes('addon.self.lib')) {
        // eslint-disable-next-line max-len
        console.warn(`Warning: ${addonId} contains unwritten addon.self.lib. It should use modern ES6 import statements.`);
    }
};

const rewriteAssetImports = contents => {
    // Reroute addon.self.dir concatenation to call runtime function.
    // Parse things like:
    // el.src = addon.self.dir + "/" + name + ".svg";
    //          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  match
    //                           ^^^^^^^^^^^^^^^^^^^  capture group 1
    contents = contents.replace(
        /addon\.self\.(?:dir|lib) *\+ *([^;,\n]+)/g,
        (_fullText, name) => `addon.self.getResource(${name}) /* rewritten by pull.js */`
    );
    return contents;
};

const normalizeManifest = (id, manifest) => {
    const KEEP_TAGS = [
        'recommended',
        'theme',
        'beta',
        'danger'
    ];
    manifest.tags = manifest.tags.filter(i => KEEP_TAGS.includes(i));
    if (newAddons.includes(id)) {
        manifest.tags.push('new');
    }

    delete manifest.versionAdded;
    delete manifest.latestUpdate;
    delete manifest.libraries;
    delete manifest.injectAsStyleElt;
    delete manifest.updateUserstylesOnSettingsChange;

    // All addons have dynamic enable
    delete manifest.dynamicEnable;

    const filterUserscripts = scripts => scripts
        .filter(({matches}) => !matches || matches.includes('projects') || matches.includes('https://scratch.mit.edu/projects/*'))
        .map(obj => ({
            url: obj.url,
            if: obj.if
        }));

    if (manifest.userscripts) {
        manifest.userscripts = filterUserscripts(manifest.userscripts);
    }
    if (manifest.userstyles) {
        manifest.userstyles = filterUserscripts(manifest.userstyles);
    }

    if (manifest.credits) {
        for (const {link} of manifest.credits) {
            if (link && !link.startsWith('https://scratch.mit.edu/')) {
                console.warn(`Warning: ${id} contains unsafe credit link: ${link}`);
            }
        }
    }
};

const generateManifestEntry = (id, manifest) => {
    const trimmedManifest = clone(manifest);
    delete trimmedManifest.enabledByDefaultMobile;
    delete trimmedManifest.permissions;

    let result = '/* generated by pull.js */\n';
    result += `const manifest = ${JSON.stringify(trimmedManifest, null, 2)};\n`;
    if (typeof manifest.enabledByDefaultMobile === 'boolean') {
        result += 'import {isMobile} from "../../environment";\n';
        result += `if (isMobile) manifest.enabledByDefault = ${manifest.enabledByDefaultMobile};\n`;
    }
    if (manifest.permissions && manifest.permissions.includes('clipboardWrite')) {
        result += 'import {clipboardSupported} from "../../environment";\n';
        result += 'if (!clipboardSupported) manifest.unsupported = true;\n';
    }
    if (id === 'mediarecorder') {
        result += 'import {mediaRecorderSupported} from "../../environment";\n';
        result += 'if (!mediaRecorderSupported) manifest.unsupported = true;\n';
    }
    if (id === 'tw-disable-cloud-variables') {
        result += 'import {isScratchDesktop} from "../../../lib/isScratchDesktop";\n';
        result += 'if (isScratchDesktop()) manifest.unsupported = true;\n';
    }
    result += 'export default manifest;\n';
    return result;
};

const generateRuntimeEntry = (id, manifest, assets) => {
    const importSection = new GeneratedImports();
    let exportSection = 'export const resources = {\n';

    for (const userscript of manifest.userscripts || []) {
        const src = userscript.url;
        const importName = importSection.add(`./${src}`, 'js');
        exportSection += `  ${JSON.stringify(src)}: ${importName},\n`;
    }

    for (const userstyle of manifest.userstyles || []) {
        const src = userstyle.url;
        const importName = importSection.add(`!css-loader!./${src}`, 'css');
        exportSection += `  ${JSON.stringify(src)}: ${importName},\n`;
    }

    for (const assetName of assets) {
        const importName = importSection.add(`!url-loader!./${assetName}`, 'asset');
        exportSection += `  ${JSON.stringify(assetName)}: ${importName},\n`;
    }

    exportSection += '};\n';
    let result = '/* generated by pull.js */\n';
    result += importSection.toString();
    result += exportSection;
    return result;
};

const addonIdToManifest = {};
const processAddon = (id, oldDirectory, newDirectory) => {
    const files = walk(oldDirectory);

    const ASSET_EXTENSIONS = [
        '.svg',
        '.png'
    ];
    const assets = files.filter(file => ASSET_EXTENSIONS.some(extension => file.endsWith(extension)));

    for (const file of files) {
        const oldPath = pathUtil.join(oldDirectory, file);
        let contents = fs.readFileSync(oldPath);

        const newPath = pathUtil.join(newDirectory, file);
        fs.mkdirSync(pathUtil.dirname(newPath), {recursive: true});

        if (file === 'addon.json') {
            contents = contents.toString('utf-8');
            const parsedManifest = JSON.parse(contents);
            normalizeManifest(id, parsedManifest);
            addonIdToManifest[id] = parsedManifest;

            const settingsEntryPath = pathUtil.join(newDirectory, '_manifest_entry.js');
            fs.writeFileSync(settingsEntryPath, generateManifestEntry(id, parsedManifest));

            const runtimeEntryPath = pathUtil.join(newDirectory, '_runtime_entry.js');
            fs.writeFileSync(runtimeEntryPath, generateRuntimeEntry(id, parsedManifest, assets));
            continue;
        }

        if (file.endsWith('.js') || file.endsWith('.css')) {
            contents = contents.toString('utf-8');

            if (file.endsWith('.js')) {
                includeImportedLibraries(contents);
                contents = includePolyfills(contents);
                contents = rewriteAssetImports(contents);
            }

            detectUnimplementedAPIs(id, contents);
        }

        fs.writeFileSync(newPath, contents);
    }
};

const SKIP_MESSAGES = [
    'debugger/@description',
    'debugger/@settings-name-log_max_list_length',
    'debugger/log-msg-list-append-too-long',
    'debugger/log-msg-list-insert-too-long',
    'debugger/@settings-name-log_invalid_cloud_data',
    'debugger/log-cloud-data-nan',
    'debugger/log-cloud-data-too-long',
    'debugger/tab-performance',
    'debugger/performance-framerate-title',
    'debugger/performance-framerate-graph-tooltip',
    'debugger/performance-clonecount-title',
    'debugger/performance-clonecount-graph-tooltip',
    'editor-devtools/extension-description-not-for-addon',
    'mediarecorder/added-by',
    'editor-theme3/@settings-name-sa-color',
    'editor-theme3/@settings-name-forums',
    'block-switching/@settings-name-sa'
];

const parseMessageDirectory = localeRoot => {
    const settings = {};
    const runtime = {};
    const upstreamMessageIds = new Set();

    for (const addon of addons) {
        const path = pathUtil.join(localeRoot, `${addon}.json`);
        try {
            const contents = fs.readFileSync(path, 'utf-8');
            const parsed = JSON.parse(contents);
            for (const id of Object.keys(parsed).sort()) {
                upstreamMessageIds.add(id);
                if (SKIP_MESSAGES.includes(id)) {
                    continue;
                }

                const value = parsed[id];
                if (id.includes('/@')) {
                    settings[id] = value;
                } else {
                    runtime[id] = value;
                }
            }
        } catch (e) {
            // Ignore errors caused by file not existing.
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
    }

    return {
        settings,
        runtime,
        upstreamMessageIds
    };
};

const generateEntries = (items, callback) => {
    let exportSection = 'export default {\n';
    const importSection = new GeneratedImports();
    for (const i of items) {
        const {src, name, type} = callback(i);
        if (type === 'lazy-import') {
            // eslint-disable-next-line max-len
            exportSection += `  ${JSON.stringify(i)}: () => import(/* webpackChunkName: ${JSON.stringify(name)} */ ${JSON.stringify(src)}),\n`;
        } else if (type === 'lazy-require') {
            exportSection += `  ${JSON.stringify(i)}: () => require(${JSON.stringify(src)}),\n`;
        } else if (type === 'eager-import') {
            const importName = importSection.add(src, i);
            exportSection += `  ${JSON.stringify(i)}: ${importName},\n`;
        } else {
            throw new Error(`Unknown type: ${type}`);
        }
    }
    exportSection += '};\n';
    let result = '/* generated by pull.js */\n';
    result += importSection.toString();
    result += exportSection;
    return result;
};

const generateL10nEntries = locales => generateEntries(
    locales.filter(i => i !== 'en'),
    locale => ({
        name: `addon-l10n-${locale}`,
        src: `../addons-l10n/${locale}.json`,
        type: 'lazy-import'
    })
);

const generateL10nSettingsEntries = locales => generateEntries(
    locales.filter(i => i !== 'en'),
    locale => ({
        src: `../addons-l10n-settings/${locale}.json`,
        type: 'lazy-require'
    })
);

const generateRuntimeEntries = () => generateEntries(
    addons,
    id => {
        const manifest = addonIdToManifest[id];
        return {
            src: `../addons/${id}/_runtime_entry.js`,
            // Include default addons in a single bundle
            name: manifest.enabledByDefault ? 'addon-default-entry' : `addon-entry-${id}`,
            // Include default addons useful outside of the editor in the original bundle, no request required
            type: (manifest.enabledByDefault && !manifest.editorOnly) ? 'lazy-require' : 'lazy-import'
        };
    }
);

const generateManifestEntries = () => generateEntries(
    addons,
    id => ({
        src: `../addons/${id}/_manifest_entry.js`,
        type: 'eager-import'
    })
);

for (const addon of addons) {
    const oldDirectory = pathUtil.resolve(__dirname, 'ScratchAddons', 'addons', addon);
    const newDirectory = pathUtil.resolve(__dirname, 'addons', addon);
    processAddon(addon, oldDirectory, newDirectory);
}

const l10nFiles = fs.readdirSync(pathUtil.resolve(__dirname, 'ScratchAddons', 'addons-l10n'));
const languages = [];
const allUpstreamMessageIds = new Set();
for (const file of l10nFiles) {
    const oldDirectory = pathUtil.resolve(__dirname, 'ScratchAddons', 'addons-l10n', file);
    // Ignore README
    if (!fs.statSync(oldDirectory).isDirectory()) {
        continue;
    }
    // Convert pt-br to just pt
    const fixedName = file === 'pt-br' ? 'pt' : file;
    languages.push(fixedName);
    const runtimePath = pathUtil.resolve(__dirname, 'addons-l10n', `${fixedName}.json`);
    const settingsPath = pathUtil.resolve(__dirname, 'addons-l10n-settings', `${fixedName}.json`);
    const {settings, runtime, upstreamMessageIds} = parseMessageDirectory(oldDirectory);
    for (const id of upstreamMessageIds) {
        allUpstreamMessageIds.add(id);
    }
    fs.writeFileSync(runtimePath, JSON.stringify(runtime, null, 4));
    if (fixedName !== 'en') {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
    }
}

for (const id of SKIP_MESSAGES) {
    if (!allUpstreamMessageIds.has(id)) {
        console.warn(`Warning: Translation ${id} is in SKIP_MESSAGES but does not exist`);
    }
}

fs.writeFileSync(pathUtil.resolve(generatedPath, 'l10n-entries.js'), generateL10nEntries(languages));
fs.writeFileSync(pathUtil.resolve(generatedPath, 'l10n-settings-entries.js'), generateL10nSettingsEntries(languages));
fs.writeFileSync(pathUtil.resolve(generatedPath, 'addon-entries.js'), generateRuntimeEntries(languages));
fs.writeFileSync(pathUtil.resolve(generatedPath, 'addon-manifests.js'), generateManifestEntries(languages));

const upstreamMetaPath = pathUtil.resolve(generatedPath, 'upstream-meta.json');
fs.writeFileSync(upstreamMetaPath, JSON.stringify({
    commit: commitHash
}));
