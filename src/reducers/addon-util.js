const SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE = 'scratch-gui/addon-util/SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE';
const SET_REACTIVE_SETTINGS = 'scratch-gui/addon-util/SET_REACTIVE_SETTINGS';

const initialState = {
    soundEditorWaveformChunkSize: 1024,
    editorAnimPref: 'none',
    editorDeleteAnim: 'shrink'
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE:
            return {
                soundEditorWaveformChunkSize: action.chunkSize
            };
        case SET_REACTIVE_SETTINGS:
            return {
                editorAnimPref: action.animPref,
                editorDeleteAnim: action.deleteAnim
            };
        default:
            return state;
    }
};

const setSoundEditorWaveformChunkSize = function (chunkSize) {
    return {
        type: SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE,
        chunkSize: chunkSize
    };
};

const setReactiveSettings = function (settings) {
    return {
        type: SET_REACTIVE_SETTINGS,
        settings: settings
    };
};



export {
    reducer as default,
    initialState as addonUtilInitialState,
    setSoundEditorWaveformChunkSize,
    setReactiveSettings
};