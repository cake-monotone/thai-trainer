import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Review from './Review';
import Drill from './Drill';

import {
  lowCharacters,
  midCharacters,
  highCharacters,
} from '../../services/Tones';
import { useParams } from 'react-router-dom';

const lowChars = lowCharacters.split('');
const midChars = midCharacters.split('');
const highChars = highCharacters.split('');

const ConsonantClasses = ({
  confusions,
  initializeConsonants,
//   initializeTones,
}) => {
  useEffect(() => {
    // initializeTones();
    initializeConsonants();
  }, [initializeConsonants]);

  const { type } = useParams();
  return (
    <div className="consonant-classes">
      {type === undefined ? (
        <Review
          {...this.props}
          low={lowChars}
          mid={midChars}
          high={highChars}
          confusions={confusions}
        />
      ) : (
        <Drill type={type} low={lowChars} high={highChars} mid={midChars} />
      )}
    </div>
  );
};

ConsonantClasses.propTypes = {
  confusions: PropTypes.array,
  initializeConsonants: PropTypes.func.isRequired,
  initializeTones: PropTypes.func.isRequired,
};
export default ConsonantClasses;
