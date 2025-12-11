/* eslint-disable import/no-commonjs */
// eslint-disable-next-line import/no-nodejs-modules
const fs = require('fs');
const path = require('path');
// editor messages are mjs, but simply export a JSON file
const editor = Object.assign(
    JSON.parse(fs.readFileSync(require.resolve('@turbowarp/scratch-l10n/locales/editor-msgs'), 'utf8').slice(34, -2)),
    require('./generated-translations.json')
);
const pmTranslators = ["en", "es", "es-419", "pt-br", "cs", "hr", "vi", "ro", "ru", "ja", "fr", "fr-ca", "de", "da", "pl", "no", "it", "tr", "sv", "sk", "uk", "he", "fa"]

const allTexts = [];
for (const file of fs.readdirSync('../../../translations', { recursive: true })) {
    const real = path.resolve('../../../translations', file);
    if (!real.endsWith('.json')) continue;
    const entries = JSON.parse(fs.readFileSync(real, 'utf8'));
    for (const ent of entries)
        allTexts.push([ent.id, ent.defaultMessage, ent.description]);
}

fs.rmSync('./editor-translation-keys', { recursive: true, force: true });
fs.mkdirSync('./editor-translation-keys');
for (const lang of pmTranslators) {
    const filled = allTexts
        .filter(([id]) => !editor[lang]?.[id])
        .filter(([id]) => id.startsWith('pm'))
        .map(([id, text, desc]) => [id, text, desc]);
    if (filled.length <= 0) continue;
    console.log(lang, (((allTexts.length - filled.length) / allTexts.length) * 100).toFixed(1) + '%');
    fs.writeFileSync(`./editor-translation-keys/${lang}.csv`, filled.map(line => line.join('\t')).join('\n'));
}
