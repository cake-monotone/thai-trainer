import React from 'react';
import PropTypes from 'prop-types';
import VoiceSelector from './VoiceSelector';
import RateSelector from './RateSelector';
import PronunciationSelector from './PronunciationSelector';

import './Settings.css';
import 'rc-slider/assets/index.css';

const Settings = ({ englishVoice, englishVoices, thaiVoice, thaiVoices, rate, setEnglishVoice, setThaiVoice, setRate, changeView, pronunciationType, changePronunciationType, words, saySample }) => {
    return <div className="settings">
        <button className="back-button" onClick={ () => changeView('navigation') }>Back</button>
        <section>
            <PronunciationSelector pronunciationType={ pronunciationType } changePronunciationType={ changePronunciationType } words={ words } saySample={ saySample } />
        </section>
        <section>
            <VoiceSelector heading="Thai voices" voices={ thaiVoices } selectedVoice={ thaiVoice } onSelectVoice={ setThaiVoice } />
        </section>
        <section>
            <VoiceSelector heading="English voices" voices={ englishVoices } selectedVoice={ englishVoice } onSelectVoice={ setEnglishVoice } />
        </section>
        <section>
            <RateSelector value={ rate } onChange={setRate} />
        </section>
    </div>;
};

const voicePropType = PropTypes.shape({
    name: PropTypes.string,
});

Settings.propTypes = {
    changeView: PropTypes.func.isRequired,
    englishVoice: voicePropType,
    englishVoices: PropTypes.arrayOf(voicePropType),
    thaiVoice: voicePropType,
    thaiVoices: PropTypes.arrayOf(voicePropType),
    rate: PropTypes.number,
    setEnglishVoice: PropTypes.func,
    setThaiVoice: PropTypes.func,
    setRate: PropTypes.func,
    pronunciationType: PropTypes.string,
    changePronunciationType: PropTypes.func,
    words: PropTypes.arrayOf(PropTypes.shape({
        thai: PropTypes.string.isRequired,
        ipa: PropTypes.string.isRequired,
        paiboon: PropTypes.string.isRequired,
    })),
    saySample: PropTypes.func.isRequired
};

export default Settings;