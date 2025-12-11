import JSZip from 'jszip';
import uid from './uid';
import { stringify, parse } from './json-circular';

/**
 * String.prototype.indexOf, but it returns NaN not -1 on failure
 * @param {string} str The string to check in
 * @param {string} key The vaue to search for
 * @param {number?} offset The offset into the string to start from
 * @returns {number} The index of the key, or NaN if no instances where found
 */
const _lastIndexNaN = (str, key, offset = Infinity) => {
    if (!str) return NaN;
    const val = str.lastIndexOf(key, offset);
    if (val === -1) return NaN;
    return val;
};
const browserHasStack = !!new Error().stack;
/**
 * @typedef {'anonymous'|'eval'|'Function'|'GeneratorFunction'|'AsyncFunction'|'AsyncGeneratorFunction'} EvalName
 *  Set to anonymous in any browser context that does not supply any of the other valid types
 */
/**
 * @typedef {'log'|'warn'|'error'|'debug'|'info'|'promiseError'} LogType
 */
/**
 * @typedef {Object} StackTrace
 * @param {string} name Name/path of the function
 * @param {string} url The url on which this error exists
 * @param {[number,number]} evalOrigin The line/column inside an eval call.
 *  Is null for none-eval-shaped calls.
 * @param {EvalName?} evalType The type of eval this was ran with, such as 'eval', null or 'Function'
 * @param {[number,number]} origin The line/column that this call is from, any one of these
 *  values can be NaN to stand in for N/A.
 */
/**
 * @typedef {Object} LogEntry
 * @prop {number} time The time stamp at which this log was pushed
 * @prop {LogType} type The type of this error
 * @prop {string|any[]} message The error message/log arguments
 * @prop {StackTrace[]} trace The stack trace leading to this log
 */
/** @type {LogEntry[]} */
const consoleLogs = [];

/**
 * Pushes a message into the console log list
 * @param {LogType} type The type of message to log
 * @param {string} message The error, literally what else is there to say
 * @param {StackTrace[]} trace The stack trace of this log
 */
const push = (type, message, trace) => {
    // try to keep logs temporaly relevant, as long lengths of run time could make this array over flow
    while (consoleLogs.length > 10000)
        consoleLogs.shift();
    consoleLogs.push({
        time: Date.now(),
        type,
        message,
        trace
    });
};
const _parseFirefoxStack = stack => stack.split('\n').slice(1)
    .map(line => {
        const at = line.indexOf('@');
        const secondCol = line.lastIndexOf(':');
        const firstCol = line.lastIndexOf(':', secondCol -1);
        const endLine = line.length;
        const name = line.slice(0, at);
        let url = line.slice(at +1, firstCol);
        let evalType = null;
        let origin = [
            Number(line.slice(firstCol +1, secondCol)),
            Number(line.slice(secondCol +1, endLine))
        ];
        let evalOrigin = null;
        /** @type {RegExpMatchArray} */
        let match;
        if ((match = url.match(/^ line ([0-9]+) > /))) {
            url = line.slice(at, match.index);
            evalOrigin = origin;
            evalType = line.slice(match.index + match[0].length, firstCol);
            origin = [Number(match[1]), NaN];
        }

        return {
            name,
            url,
            evalOrigin,
            evalType,
            origin
        };
    });
const _parseChromeStack = stack => stack.split('\n').slice(2)
    .map(line => {
        // we have no use for the human readable fluff
        line = line.slice(7);
        const firstOpenParen = line.indexOf('(');
        const secondOpenParen = line.indexOf('(', firstOpenParen +1);
        const firstCloseParen = line.indexOf(')');
        const secondCloseParen = line.indexOf(')', firstCloseParen +1);
        let fourthCol = line.lastIndexOf(':');
        let thirdCol = line.lastIndexOf(':', (fourthCol || line.length) -1);
        let secondCol = _lastIndexNaN(line, ':', (thirdCol || line.length) -1);
        let firstCol = _lastIndexNaN(line, ':', (secondCol || line.length) -1);
        if (secondOpenParen === -1) {
            secondCol = fourthCol;
            firstCol = thirdCol;
            fourthCol = NaN;
            thirdCol = NaN;
        }
        const name = line.slice(0, firstOpenParen -1);
        const origin = [
            Number(line.slice(firstCol +1, secondCol)),
            Number(line.slice(secondCol +1, thirdCol || firstCloseParen))
        ];
        let url = line.slice(firstOpenParen +1, firstCol);
        let evalType = null;
        let evalOrigin = null;
        if (secondOpenParen !== -1) {
            url = line.slice(secondOpenParen +1, firstCol);
            evalType = 'anonymous';
            evalOrigin = [
                Number(line.slice(thirdCol +1, fourthCol)),
                Number(line.slice(fourthCol +1, secondCloseParen))
            ];
        }

        return {
            name,
            url,
            evalOrigin,
            evalType,
            origin
        };
    });
const parseStack = (stack, url, line, column) => {
    if (!browserHasStack || !stack) {
        return [{
            name: '<inaccessible>',
            url,
            origin: [line, column]
        }];
    }
    // firefox has a *completely* different style rule compared to chrome
    if (stack.split('\n', 2)[0].includes('@')) return _parseFirefoxStack(stack);
    return _parseChromeStack(stack);
};
const downloadLogs = async () => {
    const files = new JSZip();
    files.file('logs.json', stringify(consoleLogs));
    const index = {};
    // get files
    // sadly, this may just dead ass fail to get files due to blob lifecycle
    // and i dont want to make these files get stored at runtime, cause poopy doo doo ram
    for (const log of consoleLogs) {
        for (const trace of log.trace) {
            if (index[trace.url]) continue;
            const id = uid();
            const content = await fetch(trace.url)
                .then(res => res.ok ? res.text() : null)
                .catch(() => {});
            if (!content) continue;
            files.file(id, content);
            index[trace.url] = id;
        }
    }
    files.file('index.json', JSON.stringify(index));
    let blob = await files.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    let filename = 'pm-error-download.pml';
    /* actually, this is a bad idea
    // if we can, include the project
    if (vm) {
        filename = 'pm-error-download.pmp';
        const archive = vm._saveProjectZip();
        archive.file('logs.json', blob);
        blob = await archive.generateAsync({
            type: 'blob',
            mimeType: 'application/x.scratch.sb3',
            compression: 'DEFLATE'
        });
    }
    */
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.append(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};
window.downloadLogs = downloadLogs;

window.addEventListener('error', e =>
    push('error', String(e.message), parseStack(`\n${e.error.stack}`, e.filename, e.lineno, e.colno)));
window.addEventListener('unhandledrejection', e => push('promiseError', String(e.reason), []));
class StackTrace extends Error {
    constructor() {
        super('');
        if (this.stack.split('\n', 2)[0].includes('@')) {
            this.stack = this.stack
                .split('\n')
                .slice(2, 3)
                .join('\n');
        } else {
            // chrome is weird ngl
            const lines = this.stack
                .split('\n')
                .slice(0, 3);
            lines.splice(1, 1);
            this.stack = lines.join('\n');
        }
    }
}
if (!(new URLSearchParams(location.search).has('nologcapture')) && (!String(window.location.href).startsWith(`http://localhost:`) || new URLSearchParams(location.search).has('nolivetests'))) {
    for (const name of ['log', 'warn', 'error', 'debug', 'info']) {
        const item = window.console[name];
        window.console[name] = (...args) => {
            let stack = [];
            if (browserHasStack) stack = parseStack(new Error().stack);
            push(name, args, stack);
            item.call(console, ...args, new StackTrace());
        };
    }
}
export { consoleLogs, parseStack, push, downloadLogs };
