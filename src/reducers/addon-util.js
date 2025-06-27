const SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE = 'scratch-gui/addon-util/SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE';
const SET_EDITOR_ANIM_PREF = 'scratch-gui/addon-util/SET_EDITOR_ANIM_PREF';

const initialState = {
    soundEditorWaveformChunkSize: 1024,
    editorAnimPref: 'default'
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE:
            return {
                soundEditorWaveformChunkSize: action.chunkSize
            };
        case SET_EDITOR_ANIM_PREF:
            return {
                editorAnimPref: action.animPref
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

const setEditorAnimPref = function (preference) {
    return {
        type: SET_EDITOR_ANIM_PREF,
        animPref: preference
    };
};

export {
    reducer as default,
    initialState as addonUtilInitialState,
    setSoundEditorWaveformChunkSize,
    setEditorAnimPref
};