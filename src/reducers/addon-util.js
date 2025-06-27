const SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE = 'scratch-gui/addon-util/SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE';

const initialState = {
    soundEditorWaveformChunkSize: 1024,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_SOUND_EDITOR_WAVEFORM_CHUNK_SIZE:
            return {
                soundEditorWaveformChunkSize: action.chunkSize
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

export {
    reducer as default,
    initialState as addonUtilInitialState,
    setSoundEditorWaveformChunkSize
};