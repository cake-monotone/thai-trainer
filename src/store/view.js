import { STATUS_PRACTICE } from '../services/Leitner';
import { TEST_SETTESTTYPE, TEST_COMPLETETEST } from './tests';
export const VIEW_CHANGEVIEW = 'view/changeview';
const VIEW_CHANGEPREVIEWFILTER = 'view_changepreviewfilter';


const defaultState = {
    currentView: null,
    previewFilter: [STATUS_PRACTICE]
};

export const reducer = (state=defaultState, { type, payload }) => {
    if (type === VIEW_CHANGEVIEW) return { ...state, currentView: payload };
    else if (type === TEST_SETTESTTYPE ) return { ...state, currentView: 'test' };
    else if (type === TEST_COMPLETETEST) return { ...state, currentView: 'testresults' };
    else if (type === VIEW_CHANGEPREVIEWFILTER) {
        let previewFilter = state.previewFilter.filter(status => status !== payload);
        if (previewFilter.length === state.previewFilter.length) previewFilter.push(payload);

        return { ...state, previewFilter };
    }

    return state;
};

const changeView = (view=null) => dispatch => dispatch({ type: VIEW_CHANGEVIEW, payload: view });
const togglePreviewFilterStatus = status => dispatch => dispatch({ type: VIEW_CHANGEPREVIEWFILTER, payload: status });

export const operations = {
    changeView,
    togglePreviewFilterStatus,
};