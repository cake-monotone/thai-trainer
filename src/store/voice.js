import { init, getAll, setThaiVoice, setEnglishVoice, setRate } from '../services/Voices';

const VOICE_SETVOICES = 'voice/setvoices';
const VOICE_SETENGLISHVOICE = 'voice/setEnglishVoice';
const VOICE_SETTHAIVOICE = 'voice/setThaiVoice';
const VOICE_SETRATE = 'voice/setRate';

const defaultState = {
    thaiVoice: null,
    thaiVoices: [],
    englishVoice: null,
    englishVoices: [],
    rate: 1
};

export const reducer = (state=defaultState, action) => {
    if (action.type === VOICE_SETVOICES) {
        const { thaiVoices, englishVoices, thaiVoice, englishVoice, rate } = action.payload;
        return {...state, thaiVoices, thaiVoice, englishVoices, englishVoice, rate };
    }
    if (action.type === VOICE_SETENGLISHVOICE) {
        setEnglishVoice(action.payload);
        const { englishVoice } = getAll();
        return { ...state, englishVoice };
    }
    if (action.type === VOICE_SETTHAIVOICE) {
        setThaiVoice(action.payload);
        const { thaiVoice } = getAll();
        return { ...state, thaiVoice };
    }
    if (action.type === VOICE_SETRATE) {
        setRate(action.payload);
        const { rate } = getAll();
        return { ...state, rate };
    }

    return state;
};

const initializeVoiceManager = () => async dispatch => {
    await init();
    dispatch({ type: VOICE_SETVOICES, payload: getAll() });
};

export const operations = {
    initializeVoiceManager,
    setEnglishVoice: voice => dispatch => dispatch({ type: VOICE_SETENGLISHVOICE, payload: voice}),
    setThaiVoice: voice => dispatch => dispatch({ type: VOICE_SETTHAIVOICE, payload: voice}),
    setRate: rate => dispatch => dispatch({ type: VOICE_SETRATE, payload: rate }),
};