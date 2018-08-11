import { getDayOfEpoch, buildRandomizedValuesQueue } from '../services/Utils';
import { getOutstandingWords, getCurrentPracticeWords } from '../services/Leitner';

import { TEST_TYPECURRENT, TEST_STAGE1 } from '../services/Leitner';
import { VIEW_CHANGEVIEW } from '../store/view';

export const TEST_SETTESTTYPE = 'test/settesttype';
export const TEST_COMPLETETEST = 'test/completetest';
const TEST_SETTESTWORDS = 'test/settesetwords';
const TEST_ACCEPTANSWER = 'test/acceptanswer';

const getRandomQueue = buildRandomizedValuesQueue(3);

// TODO: Remove stub values
const defaultState = {
    testWords: [],
    queue: [],
    scores: [],
    type:  null,
    stage: null,
    isComplete: false,
    index: null,
    selectedAnswer: null,
    possibleAnswers: null,
};

export const reducer = (state = defaultState, { type, payload }) => {
    if (type === TEST_ACCEPTANSWER) return { ...state, ...payload };
    if (type === TEST_SETTESTWORDS) return { ...state, testWords: payload };
    if (type === TEST_SETTESTTYPE) return { ...state, ...payload };
    if (type === TEST_COMPLETETEST) return { ...state, ...payload, isComplete: true };
    if (type === VIEW_CHANGEVIEW && payload !== 'test') return { ...state, ...defaultState };

    return state;
};

const getCurrentWords = (words) => dispatch => {
    const currentWords = getCurrentPracticeWords(words);
    dispatch({ type: TEST_SETTESTWORDS, payload: currentWords });
};
const getOverdueWords = (words) => dispatch => {
    const overdueWords = getOutstandingWords(words, getDayOfEpoch(new Date()));
    dispatch({ type: TEST_SETTESTWORDS, payload: overdueWords });
};
const setTestType = (type) => (dispatch, getState) => {
    const stage = TEST_STAGE1;
    const index = 0;
    const { words: { words }, settings: { testingWordLimit }} = getState();

    const testWords = (type === TEST_TYPECURRENT ? getCurrentPracticeWords(words) : getOutstandingWords(words, getDayOfEpoch())).slice(0, testingWordLimit);
    const queue = getRandomQueue(testWords);
    const scores = new Array(queue.length).fill(0);

    dispatch({ type: TEST_SETTESTTYPE, payload: { type, testWords, queue, stage, index, scores } });
};
const submitAnswer = (correct) => (dispatch, getState) => {
    let { test: { index, queue, scores, stage, testWords }, words: { words } } = getState();
    const score = correct === null ? 0 : correct ? 1 : -1;
    scores = [...scores.slice(0, index), { id: queue[index].id, score, stage }, ...scores.slice(index + 1)];
    index += 1;
    stage = Math.floor(index / testWords.length);
    if (index < scores.length) {
        dispatch({ type: TEST_ACCEPTANSWER, payload: { scores, index, stage }});
    } else {
        dispatch({ type: TEST_COMPLETETEST, payload: { scores }});
    }
};

export const operations = {
    getCurrentWords,
    getOverdueWords,
    setTestType,
    submitAnswer,
};