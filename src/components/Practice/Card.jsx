import React from 'react';
import PropTypes from 'prop-types';
import Line from './Line';
import { classNames } from '../../services/Utils';

const Card = ({
  word,
  onClick,
  pronunciationType,
  stage,
  practiceOrder,
  practiceAllAtOnce,
  showCharacterClasses,
}) => {
  const lines = practiceOrder.map((prop, index) => (
    <Line
      key={prop}
      index={index}
      type={practiceOrder[index]}
      practiceAllAtOnce={practiceAllAtOnce}
      pronunciationType={pronunciationType}
      stage={stage}
      word={word}
      showCharacterClasses={showCharacterClasses}
      prop={prop}
    />
  ));
  const nextButton = stage > 1 ? '»' : '›';
  return (
    <div
      onClick={onClick}
      className={classNames({ card: true, practiceAllAtOnce })}
    >
      {lines}
      <span className="next-button">{nextButton}</span>
    </div>
  );
};

Card.propTypes = {
  word: PropTypes.shape({
    term: PropTypes.string.isRequired,
    thai: PropTypes.string.isRequired,
    ipa: PropTypes.string.isRequired,
    paiboon: PropTypes.string.isRequired,
  }).isRequired,
  pronunciationType: PropTypes.string.isRequired,
  stage: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  practiceAllAtOnce: PropTypes.bool.isRequired,
  practiceOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  showCharacterClasses: PropTypes.bool.isRequired,
};

export default Card;
