import { connect } from 'react-redux';
import { operations } from '../../store';
import Settings from './Settings';

import '../../styles/Settings.scss';

const mapStateToProps = ({
    voice: {thaiVoice, thaiVoices, englishVoice, englishVoices, rate},
    words: { words },
    settings: { thaiFont, pronunciationType, practiceWordLimit, testingWordLimit, practiceOrder, practiceAllAtOnce, showCharacterClasses, resetProgressVisible },
}) => ({
    words,
    englishVoice,
    englishVoices,
    thaiVoice,
    thaiVoices,
    thaiFont,
    rate,
    pronunciationType,
    practiceWordLimit,
    testingWordLimit,
    practiceOrder,
    practiceAllAtOnce,
    showCharacterClasses,
    resetProgressVisible,
});

export default connect(mapStateToProps, operations)(Settings);