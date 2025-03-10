import React from 'react';
import PropTypes from 'prop-types';
import {
  PRONUNCIATIONTYPE_IPA,
  PRONUNCIATIONTYPE_PAIBOON,
} from '../../services/WordManager';
import PlayButton from '../common/PlayButton';
import ProgressIcon from '../common/ProgressIcon';

const getPronunciation = (ipa, paiboon, pronunciationType) =>
  pronunciationType === PRONUNCIATIONTYPE_IPA ? ipa : paiboon;

const ProgressItem = ({ word, pronunciationType, showProgress }) => {
  const { term, thai, ipa, paiboon, aspectScores = [0, 0] } = word;

  return (
    <tr>
      <td>{term}</td>
      <td className="thai-font">{thai}</td>
      <td>
        <PlayButton word={word} />{' '}
        {getPronunciation(ipa, paiboon, pronunciationType)}
      </td>
      {showProgress ? (
        <td className="progress-icons">
          <ProgressIcon progress={Math.min(...aspectScores) / 5} />
        </td>
      ) : null}
    </tr>
  );
};

ProgressItem.propTypes = {
  word: PropTypes.shape({
    term: PropTypes.string.isRequired,
    thai: PropTypes.string.isRequired,
    ipa: PropTypes.string.isRequired,
    paiboon: PropTypes.string.isRequired,
    aspectScores: PropTypes.arrayOf(PropTypes.number),
  }),
  pronunciationType: PropTypes.oneOf([
    PRONUNCIATIONTYPE_IPA,
    PRONUNCIATIONTYPE_PAIBOON,
  ]),
  showProgress: PropTypes.bool.isRequired,
};

export default ProgressItem;
