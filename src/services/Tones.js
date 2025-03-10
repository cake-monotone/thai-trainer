import { memoize } from './Utils';

export const TONE_CLASS_HIGH = 1;
export const TONE_CLASS_MID = 2;
export const TONE_CLASS_LOW = 3;
export const TONE_LOW = 4;
export const TONE_MID = 5;
export const TONE_HIGH = 6;
export const TONE_RISING = 7;
export const TONE_FALLING = 8;
export const TONE_ENDING_STOP = 9;
export const TONE_ENDING_SONORANT = 10;
export const TONE_VOWEL_LONG = 11;
export const TONE_VOWEL_SHORT = 12;
export const TONE_MAI_EK = 13; //  ่
export const TONE_MAI_THO = 14; //  ้
export const TONE_MAI_TRI = 15; //  ๊
export const TONE_MAI_CHATTAWA = 16; //  ๋

export const lowCharacters = 'ครทมพลนชวยภซงฟธฮฆญณฒฌฑฬฅ';
export const midCharacters = 'กตปอจบดฎฏ';
export const highCharacters = 'สหขผถศฝฉฐษฃ';

const rxThai = /[ก-๛]/;
const rxZeroWidth = /[๋๊้่๎ํ์็ฺูุืึีิั]/u;
const rxFindClass = new RegExp(
  `^([${lowCharacters}]?)([${midCharacters}]?)([${highCharacters}]?)`,
  'u',
);

const rxLow = new RegExp(`[${lowCharacters}]`, 'u');
const rxMid = new RegExp(`[${midCharacters}]`, 'u');
const rxHigh = new RegExp(`[${highCharacters}]`, 'u');

export const isLow = (string) => rxLow.test(string);
export const isMid = (string) => rxMid.test(string);
export const isHigh = (string) => rxHigh.test(string);
export const isThai = (string) => rxThai.test(string);

const reducer = (components, character) => {
  if (rxZeroWidth.test(character)) {
    let [lastCharacter = '', toneClass] = components.pop();
    return [...components, [lastCharacter + character, toneClass]];
  }

  let [, lowMatch, midMath, highMatch] = rxFindClass.exec(character);

  let toneClass = lowMatch
    ? TONE_CLASS_LOW
    : midMath
      ? TONE_CLASS_MID
      : highMatch
        ? TONE_CLASS_HIGH
        : null;

  if (toneClass) return [...components, [character, toneClass]];
  return [...components, [character]];
};

export const getComponents = (input = '') =>
  input.split('').reduce(reducer, []);
export const getCachedCompents = memoize(getComponents, 100);

export const getTone = ({ character, cls, length, ending, marker }) => {
  if (cls === TONE_CLASS_HIGH || isHigh(character)) {
    if (marker === TONE_MAI_EK) return TONE_LOW;
    if (marker === TONE_MAI_THO) return TONE_FALLING;

    if (
      ending === TONE_ENDING_SONORANT ||
      (ending === null && length === TONE_VOWEL_LONG)
    )
      return TONE_RISING;
    if (
      ending === TONE_ENDING_STOP ||
      (ending === null && length === TONE_VOWEL_SHORT)
    )
      return TONE_LOW;
  } else if (cls === TONE_CLASS_MID || isMid(character)) {
    if (marker === TONE_MAI_EK) return TONE_LOW;
    if (marker === TONE_MAI_THO) return TONE_FALLING;
    if (marker === TONE_MAI_TRI) return TONE_HIGH;
    if (marker === TONE_MAI_CHATTAWA) return TONE_RISING;

    if (
      ending === TONE_ENDING_STOP ||
      (ending === null && length === TONE_VOWEL_SHORT)
    )
      return TONE_LOW;
  } else {
    if (marker === TONE_MAI_EK) return TONE_FALLING;
    if (marker === TONE_MAI_THO) return TONE_HIGH;

    if (ending === null && length === TONE_VOWEL_SHORT) return TONE_HIGH;
    if (ending === TONE_ENDING_STOP)
      return length === TONE_VOWEL_SHORT ? TONE_HIGH : TONE_FALLING;
  }

  return TONE_MID;
};

export const getTonesByStage = (stage, tones = []) => {
  let target = 0;
  stage = stage - 1;
  if (stage <= target++)
    return {
      tones: tones.filter(
        ({ length, ending, marker }) =>
          !marker &&
          (ending === TONE_ENDING_SONORANT ||
            (length === TONE_VOWEL_LONG && !ending)),
      ),
      label: `Stage ${target}: Only live (no markers)`,
      className: 'c-1',
    };
  if (stage === target++)
    return {
      tones: tones.filter(
        ({ length, ending, marker }) =>
          !marker &&
          length === TONE_VOWEL_SHORT &&
          ending !== TONE_ENDING_SONORANT,
      ),
      label: `Stage ${target}: Only dead & short (no markers)`,
      className: 'c-2',
    };
  if (stage === target++)
    return {
      tones: tones.filter(
        ({ length, ending, marker }) =>
          !marker &&
          (ending === TONE_ENDING_SONORANT || length === TONE_VOWEL_SHORT),
      ),
      label: `Stage ${target}: All live & all short (no markers)`,
      className: 'c-3',
    };
  if (stage === target++)
    return {
      tones: tones.filter(({ marker }) => !marker),
      label: `Stage ${target}: All live & dead (no markers)`,
      className: 'c-4',
    };
  if (stage === target++)
    return {
      tones: tones.filter(
        ({ marker }) => marker === TONE_MAI_EK || marker === TONE_MAI_THO,
      ),
      label: `Stage ${target}: Only mai ek & mai tho markers`,
      className: 'c-5',
    };
  if (stage === target++)
    return {
      tones: tones.filter(({ marker }) => !!marker),
      label: `Stage ${target}: All markers only`,
      className: 'c-6',
    };
  if (stage === target++)
    return {
      tones: tones.filter(({ cls }) => cls === TONE_CLASS_LOW),
      label: `Stage ${target}: Only low-class`,
      className: 'c-7',
    };
  if (stage === target++)
    return {
      tones: tones.filter(({ cls }) => cls === TONE_CLASS_MID),
      label: `Stage ${target}: Only mid-class`,
      className: 'c-8',
    };
  if (stage === target++)
    return {
      tones: tones.filter(({ cls }) => cls === TONE_CLASS_HIGH),
      label: `Stage ${target}: Only high-class`,
      className: 'c-9',
    };

  return { tones: [...tones], label: 'Everything', last: true };
};

export const getTonesDescriptors = () => {
  let descriptorsList = [];
  let stage = 1;
  let last, label, className;
  do {
    ({ last, label, className } = getTonesByStage(stage));
    descriptorsList.push({ stage, label, className });
    stage += 1;
  } while (!last);

  return descriptorsList;
};
