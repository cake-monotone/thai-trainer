describe('UtilsService', () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.resetModules());
  it('clamps', () => {
    const makeClamp = require('../Utils').makeClamp;

    let clamp = makeClamp(0, 1);
    expect(clamp(0)).toEqual(0);
    expect(clamp(1)).toEqual(1);
    expect(clamp(2)).toEqual(1);
    expect(clamp(-1)).toEqual(0);
    expect(clamp(0.5)).toEqual(0.5);

    clamp = makeClamp(1);
    expect(clamp(0.9)).toEqual(1);
    expect(clamp(Number.MIN_SAFE_INTEGER)).toEqual(1);
    expect(clamp(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);

    clamp = makeClamp(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    expect(clamp(-Number.MAX_VALUE)).toEqual(Number.MIN_SAFE_INTEGER);
    expect(clamp(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
    expect(clamp(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
    expect(clamp(Number.MAX_VALUE)).toEqual(Number.MAX_SAFE_INTEGER);

    clamp = makeClamp();
    expect(clamp(-Number.MAX_SAFE_INTEGER)).toEqual(-Number.MAX_SAFE_INTEGER);
    expect(clamp(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
    expect(clamp(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
    expect(clamp(Number.MIN_VALUE)).toEqual(Number.MIN_VALUE);
    expect(clamp(Number.MAX_VALUE)).toEqual(Number.MAX_VALUE);
    expect(clamp(0)).toEqual(0);
  });

  it('modifies an array of numbers', () => {
    const { createApplyDeltaWithLimits } = require('../Utils');
    let arr = [0, 0, 0];

    const applyOneFiveDelta = createApplyDeltaWithLimits(0, 5);
    expect(applyOneFiveDelta(arr, 2, 1)).toEqual([0, 0, 1]);
    expect(applyOneFiveDelta(arr, 1, -1)).toEqual([0, 0, 0]);
    expect(arr).toEqual([0, 0, 0]);

    expect(applyOneFiveDelta([1, 4, 5], 0, 1)).toEqual([2, 4, 5]);
    expect(applyOneFiveDelta([1, 4, 5], 1, 1)).toEqual([1, 5, 5]);
    expect(applyOneFiveDelta([1, 4, 5], 2, 1)).toEqual([1, 4, 5]);
    expect(applyOneFiveDelta([1, 4, 5], 3, 1)).toEqual([1, 4, 5]);

    expect(applyOneFiveDelta([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
    expect(applyOneFiveDelta([0, 1, 2], 1, -1)).toEqual([0, 0, 2]);
    expect(applyOneFiveDelta([0, 1, 2], 2, -1)).toEqual([0, 1, 1]);
    expect(applyOneFiveDelta([0, 1, 2], 3, -1)).toEqual([0, 1, 2]);

    arr = [0, 0, 0];
    let revised = applyOneFiveDelta(arr, 3, -1);
    expect(revised).toEqual([0, 0, 0]);
    expect(revised).toBe(arr); // ensure that the array is not a copy when nothing has changed.
  });

  it('calculates the days since the start of the epoch', () => {
    const { getDayOfEpoch } = require('../Utils');

    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const fourHours = 4 * oneHour;
    const fourAM = fourHours;
    const nineHours = 9 * oneHour;
    const oneDay = 24 * oneHour;
    const thousandDays = 1000 * oneDay;

    let timezoneOffset = 4 * 60; // e.g. New York DST: GMT-4
    let timestamp = oneDay; // 1970-01-02:000000Z

    const mockDate = {
      getTimezoneOffset: () => timezoneOffset,
      getTime: () => timestamp,
    };

    expect(mockDate.getTimezoneOffset()).toEqual(240);
    expect(mockDate.getTime()).toEqual(oneDay);

    expect(getDayOfEpoch(mockDate)).toEqual(0);

    timestamp = oneDay + fourHours + fourAM;
    expect(getDayOfEpoch(mockDate)).toEqual(1);

    timestamp = thousandDays;
    expect(getDayOfEpoch(mockDate)).toEqual(999);

    timestamp = thousandDays + fourHours + fourAM - oneMinute;
    expect(getDayOfEpoch(mockDate)).toEqual(999);

    timestamp = thousandDays + fourHours + fourAM;
    expect(getDayOfEpoch(mockDate)).toEqual(1000);

    timestamp = thousandDays + oneDay;
    expect(getDayOfEpoch(mockDate)).toEqual(1000);

    timestamp = thousandDays + oneDay + fourHours;
    expect(getDayOfEpoch(mockDate)).toEqual(1000);

    timestamp = thousandDays + oneDay + fourHours + fourAM;
    expect(getDayOfEpoch(mockDate)).toEqual(1001);

    timezoneOffset = -9 * 60; // (e.g. Japan: GMT+9)
    timestamp = oneDay;
    expect(getDayOfEpoch(mockDate)).toEqual(1);

    // In Japan, the sun's been up longer, so this is midnight Jan 2 + 9 hours
    timestamp = oneDay;
    expect(getDayOfEpoch(mockDate)).toEqual(1);

    // This is just before midnight on Jan 1
    timestamp = oneDay - nineHours - oneMinute;
    expect(getDayOfEpoch(mockDate)).toEqual(0);

    // This is just before 4am on Jan 2
    timestamp = oneDay - nineHours + fourHours - oneMinute;
    expect(getDayOfEpoch(mockDate)).toEqual(0);

    // This is 4am on Jan 2
    timestamp = oneDay - nineHours + fourHours;
    expect(getDayOfEpoch(mockDate)).toEqual(1);

    // This is just before 4am on the thousandth day
    timestamp = thousandDays - nineHours + fourHours - oneMinute;
    expect(getDayOfEpoch(mockDate)).toEqual(999);

    // THis is 4am on the thousandth day
    timestamp = thousandDays - nineHours + fourHours;
    expect(getDayOfEpoch(mockDate)).toEqual(1000);
  });
  it('sorts a word list by similarity with one of those words', () => {
    const { sortBySimilarity } = require('../Utils');

    const words = [
      {
        id: 6,
        section: 'Animals',
        term: 'Dog',
        thai: 'หมา',
        ipa: 'mǎː',
        paiboon: 'mǎa',
      },
      {
        id: 7,
        section: 'Animals',
        term: 'Fish',
        thai: 'ปลา',
        ipa: 'plaː',
        paiboon: 'bplaa',
      },
      {
        id: 8,
        section: 'Animals',
        term: 'Horse',
        thai: 'ม้า',
        ipa: 'máː',
        paiboon: 'máa',
      },
      {
        id: 9,
        section: 'Animals',
        term: 'Monkey',
        thai: 'ลิง',
        ipa: 'liŋ',
        paiboon: 'ling',
      },
      {
        id: 10,
        section: 'Animals',
        term: 'Mouse / Rat',
        thai: 'หนู',
        ipa: 'nǔː',
        paiboon: 'nǔu',
      },
      {
        id: 11,
        section: 'Animals',
        term: 'Pig',
        thai: 'หมู',
        ipa: 'mǔː',
        paiboon: 'mǔu',
      },
      {
        id: 12,
        section: 'Animals',
        term: 'Sheep',
        thai: 'แกะ',
        ipa: 'kɛ̀ʔ',
        paiboon: 'gɛ̀',
      },
    ];

    expect(sortBySimilarity(words[0], 'thai', words)).toEqual([
      {
        id: 8,
        section: 'Animals',
        term: 'Horse',
        thai: 'ม้า',
        ipa: 'máː',
        paiboon: 'máa',
      },
      {
        id: 11,
        section: 'Animals',
        term: 'Pig',
        thai: 'หมู',
        ipa: 'mǔː',
        paiboon: 'mǔu',
      },
      {
        id: 7,
        section: 'Animals',
        term: 'Fish',
        thai: 'ปลา',
        ipa: 'plaː',
        paiboon: 'bplaa',
      },
      {
        id: 10,
        section: 'Animals',
        term: 'Mouse / Rat',
        thai: 'หนู',
        ipa: 'nǔː',
        paiboon: 'nǔu',
      },
      {
        id: 9,
        section: 'Animals',
        term: 'Monkey',
        thai: 'ลิง',
        ipa: 'liŋ',
        paiboon: 'ling',
      },
      {
        id: 12,
        section: 'Animals',
        term: 'Sheep',
        thai: 'แกะ',
        ipa: 'kɛ̀ʔ',
        paiboon: 'gɛ̀',
      },
    ]);
    expect(sortBySimilarity(words[1], 'thai', words)).toEqual([
      {
        id: 6,
        section: 'Animals',
        term: 'Dog',
        thai: 'หมา',
        ipa: 'mǎː',
        paiboon: 'mǎa',
      },
      {
        id: 8,
        section: 'Animals',
        term: 'Horse',
        thai: 'ม้า',
        ipa: 'máː',
        paiboon: 'máa',
      },
      {
        id: 9,
        section: 'Animals',
        term: 'Monkey',
        thai: 'ลิง',
        ipa: 'liŋ',
        paiboon: 'ling',
      },
      {
        id: 10,
        section: 'Animals',
        term: 'Mouse / Rat',
        thai: 'หนู',
        ipa: 'nǔː',
        paiboon: 'nǔu',
      },
      {
        id: 11,
        section: 'Animals',
        term: 'Pig',
        thai: 'หมู',
        ipa: 'mǔː',
        paiboon: 'mǔu',
      },
      {
        id: 12,
        section: 'Animals',
        term: 'Sheep',
        thai: 'แกะ',
        ipa: 'kɛ̀ʔ',
        paiboon: 'gɛ̀',
      },
    ]);

    // sortBySimilarity = makeSimilaritySorter('term');
    expect(sortBySimilarity(words[0], 'term', words)).toEqual([
      {
        id: 11,
        section: 'Animals',
        term: 'Pig',
        thai: 'หมู',
        ipa: 'mǔː',
        paiboon: 'mǔu',
      },
      {
        id: 7,
        section: 'Animals',
        term: 'Fish',
        thai: 'ปลา',
        ipa: 'plaː',
        paiboon: 'bplaa',
      },
      {
        id: 8,
        section: 'Animals',
        term: 'Horse',
        thai: 'ม้า',
        ipa: 'máː',
        paiboon: 'máa',
      },
      {
        id: 9,
        section: 'Animals',
        term: 'Monkey',
        thai: 'ลิง',
        ipa: 'liŋ',
        paiboon: 'ling',
      },
      {
        id: 12,
        section: 'Animals',
        term: 'Sheep',
        thai: 'แกะ',
        ipa: 'kɛ̀ʔ',
        paiboon: 'gɛ̀',
      },
      {
        id: 10,
        section: 'Animals',
        term: 'Mouse / Rat',
        thai: 'หนู',
        ipa: 'nǔː',
        paiboon: 'nǔu',
      },
    ]);

    expect(sortBySimilarity(words[1], 'term', words)).toEqual([
      {
        id: 11,
        section: 'Animals',
        term: 'Pig',
        thai: 'หมู',
        ipa: 'mǔː',
        paiboon: 'mǔu',
      },
      {
        id: 6,
        section: 'Animals',
        term: 'Dog',
        thai: 'หมา',
        ipa: 'mǎː',
        paiboon: 'mǎa',
      },
      {
        id: 8,
        section: 'Animals',
        term: 'Horse',
        thai: 'ม้า',
        ipa: 'máː',
        paiboon: 'máa',
      },
      {
        id: 12,
        section: 'Animals',
        term: 'Sheep',
        thai: 'แกะ',
        ipa: 'kɛ̀ʔ',
        paiboon: 'gɛ̀',
      },
      {
        id: 9,
        section: 'Animals',
        term: 'Monkey',
        thai: 'ลิง',
        ipa: 'liŋ',
        paiboon: 'ling',
      },
      {
        id: 10,
        section: 'Animals',
        term: 'Mouse / Rat',
        thai: 'หนู',
        ipa: 'nǔː',
        paiboon: 'nǔu',
      },
    ]);
  });

  it('can tell if two arrays are shallowly equal', () => {
    const { arraysAreSimplyEqual } = require('../Utils');
    expect(arraysAreSimplyEqual([], [])).toBe(true);
    expect(arraysAreSimplyEqual([], [1])).toBe(false);
    expect(arraysAreSimplyEqual([1], [])).toBe(false);

    expect(arraysAreSimplyEqual([1, 2, 3, 999], [1, 2, 3, 999])).toBe(true);
    expect(arraysAreSimplyEqual([1, 2, 3, 4, 999], [1, 2, 3, 999])).toBe(false);
    expect(arraysAreSimplyEqual([1, 2, 3, 999], [1, 2, 3, 1000])).toBe(false);
  });
  it('generates a series of random values that repeat minimally', () => {
    const randomValues = [
      0.6540056371566356, 0.60261415840193, 0.1987945168012557,
      0.6226792369370973, 0.32944677232662434,
    ];
    let randomValueIndex = 0;
    global.Math.random = jest.fn(
      () => randomValues[randomValueIndex++ % randomValues.length],
    );

    const { buildRandomizedValuesQueue } = require('../Utils');
    let r = buildRandomizedValuesQueue(5);

    expect(r([1, 2])).toEqual([1, 2, 1, 2, 1, 2, 1, 2, 1, 2]);
    expect(r([1, 2, 3])).toEqual([1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 1, 2, 1, 3, 2]);
    expect(r([1, 2, 3, 5])).toEqual([
      5, 2, 1, 3, 5, 1, 2, 3, 1, 3, 5, 2, 5, 2, 1, 3, 5, 1, 2, 3,
    ]);
  });
  it('moves an element in an array', () => {
    const { moveArrayItem } = require('../Utils');
    expect(moveArrayItem([], 1, 2)).toEqual([]);
    expect(moveArrayItem([1, 2, 3], 1, 0)).toEqual([2, 1, 3]);
    expect(moveArrayItem([1, 2, 3], 1, 1)).toEqual([1, 2, 3]);
    expect(moveArrayItem([1, 2, 3], 1, 2)).toEqual([1, 3, 2]);

    expect(moveArrayItem([1, 2, 3], 0, 0)).toEqual([1, 2, 3]);
    expect(moveArrayItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
    expect(moveArrayItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);

    expect(moveArrayItem([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
    expect(moveArrayItem([1, 2, 3], 2, 1)).toEqual([1, 3, 2]);
    expect(moveArrayItem([1, 2, 3], 2, 2)).toEqual([1, 2, 3]);

    expect(moveArrayItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
    expect(moveArrayItem([1, 2, 3], 1, -1)).toEqual([2, 1, 3]);
    expect(moveArrayItem([1, 2, 3], 1, 50)).toEqual([1, 3, 2]);

    expect(moveArrayItem([1, 2, 3], -1, 2)).toEqual([1, 2, 3]);
    expect(moveArrayItem([1, 2, 3], -2, -1)).toEqual([1, 2, 3]);
  });
  it('excludes values from two arrays', () => {
    const { makeExclude } = require('../Utils');
    let exclude = makeExclude((a, b) => a.id === b.id);
    let arr1 = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ];
    expect(exclude(arr1, [])).toEqual(arr1);
    expect(exclude(arr1, [{ id: 6 }, { id: 1 }])).toEqual(arr1.slice(1, 5));
    expect(exclude(arr1, [...arr1])).toEqual([]);

    exclude = makeExclude((a, b) => a.id === b.id + 1);
    expect(exclude(arr1, [])).toEqual(arr1);
    expect(exclude(arr1, [{ id: 6 }, { id: 1 }])).toEqual([
      { id: 1 },
      ...arr1.slice(2),
    ]);
    expect(exclude(arr1, [...arr1])).toEqual([{ id: 1 }]);
  });
  it('merges object arrays by a property', () => {
    const { createMergeObjectArrayByProperty } = require('../Utils');
    let arr1 = [
      { a: 1, b: 11, c: 1 },
      { a: 2, b: 22, c: 2 },
      { a: 3, b: 33, c: 3 },
      { a: 4, b: 44, c: 4 },
    ];
    let arr2 = [
      { a: 2, b: 11, c: 5 },
      { a: 3, b: 44, c: 6 },
      { a: 4, b: 55, c: 7 },
    ];

    let merge = createMergeObjectArrayByProperty('a');
    expect(merge(arr1, [])).toEqual(arr1);
    expect(merge([], arr2)).toEqual(arr2);
    expect(merge(arr1, arr2)).toEqual([
      { a: 1, b: 11, c: 1 },
      { a: 2, b: 11, c: 5 },
      { a: 3, b: 44, c: 6 },
      { a: 4, b: 55, c: 7 },
    ]);

    merge = createMergeObjectArrayByProperty('b');
    expect(merge(arr1, [])).toEqual(arr1);
    expect(merge([], arr2)).toEqual(arr2);
    expect(merge(arr1, arr2)).toEqual([
      { a: 2, b: 11, c: 5 },
      { a: 2, b: 22, c: 2 },
      { a: 3, b: 33, c: 3 },
      { a: 3, b: 44, c: 6 },
      { a: 4, b: 55, c: 7 },
    ]);

    merge = createMergeObjectArrayByProperty('c');
    expect(merge(arr1, [])).toEqual(arr1);
    expect(merge([], arr2)).toEqual(arr2);
    expect(merge(arr1, arr2)).toEqual([
      { a: 1, b: 11, c: 1 },
      { a: 2, b: 22, c: 2 },
      { a: 3, b: 33, c: 3 },
      { a: 4, b: 44, c: 4 },
      { a: 2, b: 11, c: 5 },
      { a: 3, b: 44, c: 6 },
      { a: 4, b: 55, c: 7 },
    ]);
  });
  it('returns a randomized list of provided values, ensuring a particular value is present', () => {
    const randomValues = [
      0.8106155395507813, 0.7146610021591187, 0.06898759305477142,
      0.3258082866668701, 0.11168600618839264, 0.05064991116523743,
      0.34461453557014465, 0.20475636422634125, 0.5583593249320984,
      0.9148363471031189,
    ];
    let randomValueIndex = 0;
    global.Math.random = jest.fn(
      () => randomValues[randomValueIndex++ % randomValues.length],
    );

    const { makeUniqueRandomSamplingIncludingValue } = require('../Utils');
    let makeSample = makeUniqueRandomSamplingIncludingValue(
      ['abc', 'def', 'ghi', 'abc', 'jkl', 'mno', 'mno', 'mno', 'pqr', 'stu'],
      4,
    );
    expect(makeSample('xyz')).toEqual(['xyz', 'jkl', 'ghi', 'stu']);

    expect(makeSample('def')).toEqual(['def', 'ghi', 'abc', 'jkl']);

    for (let i = 0; i < 100; i++) {
      let samples = makeSample('def');
      expect(samples.some((v) => v === 'def')).toBe(true); // Expected value must always be present
      expect(
        samples.every((sample, index, arr) => arr.indexOf(sample) === index),
      ).toBe(true); // No sample value should appear twice
    }
  });
  it('filters a list of tones by an object of matching properties', () => {
    const { makeFilterByProps } = require('../Utils');

    const TONE_CLASS_LOW = 0;
    const TONE_CLASS_MID = 1;
    const TONE_CLASS_HIGH = 2;
    const TONE_VOWEL_SHORT = 3;
    const TONE_VOWEL_LONG = 4;
    const TONE_ENDING_STOP = 5;
    const TONE_ENDING_SONORANT = 6;
    const TONE_MAI_EK = 7;
    const TONE_MAI_CHATTAWA = 8;

    let tones = [
      {
        cls: TONE_CLASS_MID,
        length: TONE_VOWEL_SHORT,
        ending: TONE_ENDING_STOP,
        id: 1,
      },
      {
        cls: TONE_CLASS_MID,
        length: TONE_VOWEL_LONG,
        ending: TONE_ENDING_STOP,
        id: 2,
      },
      {
        cls: TONE_CLASS_MID,
        length: TONE_VOWEL_LONG,
        marker: TONE_MAI_EK,
        id: 3,
      },
      {
        cls: TONE_CLASS_LOW,
        length: TONE_VOWEL_LONG,
        ending: TONE_ENDING_SONORANT,
        marker: TONE_MAI_CHATTAWA,
        id: 4,
      },
    ];

    const getIdList = (tones) => tones.map(({ id }) => id);

    let filterByProps = makeFilterByProps(tones);

    expect(getIdList(filterByProps({ cls: [TONE_CLASS_HIGH] }))).toEqual([]);
    expect(
      getIdList(filterByProps({ cls: [TONE_CLASS_LOW, TONE_CLASS_MID] })),
    ).toEqual([1, 2, 3, 4]);
    expect(getIdList(filterByProps({ cls: [TONE_CLASS_LOW] }))).toEqual([4]);
    expect(getIdList(filterByProps({ cls: [TONE_CLASS_MID] }))).toEqual([
      1, 2, 3,
    ]);
    expect(getIdList(filterByProps({ marker: [null] }))).toEqual([1, 2]);
    expect(getIdList(filterByProps({ marker: [null, TONE_MAI_EK] }))).toEqual([
      1, 2, 3,
    ]);

    expect(getIdList(filterByProps({ length: [TONE_VOWEL_LONG] }))).toEqual([
      2, 3, 4,
    ]);
    expect(
      getIdList(
        filterByProps({ length: [TONE_VOWEL_LONG], marker: [TONE_MAI_EK] }),
      ),
    ).toEqual([3]);
    expect(
      getIdList(
        filterByProps({ cls: [TONE_CLASS_MID], ending: [TONE_ENDING_STOP] }),
      ),
    ).toEqual([1, 2]);
    expect(
      getIdList(
        filterByProps({
          length: [TONE_VOWEL_SHORT, TONE_VOWEL_LONG],
          ending: [TONE_ENDING_STOP],
        }),
      ),
    ).toEqual([1, 2]);

    expect(getIdList(filterByProps({}))).toEqual([1, 2, 3, 4]);
  });
});
