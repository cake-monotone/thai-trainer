import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import Preview from './Preview';
import CardContainer from './CardContainer';

const Practice = (props) => {
  const { practiceWordLimit, seedPractice, words, closePractice } = props;
  const { type } = useParams();
  const subview = type || null;

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      seedPractice(words, practiceWordLimit);
      hasInitialized.current = true;
    }
  }, [words, seedPractice, practiceWordLimit]);

  useEffect(() => {
    return () => {
      closePractice();
    };
  }, [closePractice]);

  return (
    <div className="practice">
      <Link className="test-button" to="/test/current">
        Test now <span className="icon">〉</span>
      </Link>
      <h1>Practice</h1>
      {subview === 'full' ? (
        <CardContainer {...props} />
      ) : (
        <Preview {...props} />
      )}
    </div>
  );
};

Practice.propTypes = {
  practiceWordLimit: PropTypes.number.isRequired,
  seedPractice: PropTypes.func.isRequired,
  closePractice: PropTypes.func.isRequired,
  words: PropTypes.array.isRequired,
};

export default Practice;
