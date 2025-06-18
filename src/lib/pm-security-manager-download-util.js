// Upstream TW list from tw-security-manager-modal, but we use this list to skip stuff not in here.
// Technically that is a security risk, but having a constant prompt for downloading innocent files
// like save data would be annoying.
//
// Common unsafe files will likely have an OS prompt, and uncommon unsafe files are likely from
// other software that the user installed, and is aware of what that software will do with said file.
const DEFINITELY_EXECUTABLE = [
    // Entries should be lowercase and without leading period.
    // Note that the user will have the final choice of whether or not to open the downloaded file.
    // A file extension missing from this list is a bug we want to fix, but not a security bug that
    // would be eligible for a vulnerability badge.

    // Anything that is missing here should also be added to the upstream TW list if it's missing there.

    // Windows executable formats
    'exe',
    'msi',
    'msix',
    'msixbundle',
    'com',
    'scf',
    'scr',
    'sct',
    'dll',
    'appx',
    'appxbundle',
    'reg',
    'iso',
    'drv',
    'sys',

    // Mac executable formats
    'app',
    'dmg',
    'pkg',

    // Unix executable formats
    'so',
    'a',
    'run',
    'appimage',
    'deb',
    'rpm',
    'snap',
    'flatpakref',

    // Cross-platform executable formats
    'jar',

    // Browser extensions
    'crx',
    'xpi',

    // Shortcuts
    'url',
    'webloc',
    'inetloc',
    'lnk',
    'shortcut',

    // Windows scripting languages
    'bat',
    'cmd',
    'ps1',
    'psm1',
    'asp',
    'vbs',
    'vbe',
    'ws',
    'wsf',
    'wsc',
    'ahk',

    // Microsoft Office macros
    'docm',
    'dotm',
    'xlm',
    'xlsm',
    'xltm',
    'xla',
    'xlam',
    'pptm',
    'potm',
    'ppsm',
    'sldm',

    // Unix scripting languages
    'sh',

    // Common cross-platform languages with interpreters that could be executed by double clicking on the file
    'js',
    'py'
];

/**
 * @param {string} name Name of file
 * @returns {boolean} True indicates definitely dangerous. False does not mean safe.
 */
const isDefinitelyExecutable = name => {
    const parts = name.split('.');
    const extension = parts.length > 1 ? parts.pop().toLowerCase() : null;
    return extension !== null && DEFINITELY_EXECUTABLE.includes(extension);
};

export {
    DEFINITELY_EXECUTABLE,
    isDefinitelyExecutable,
};