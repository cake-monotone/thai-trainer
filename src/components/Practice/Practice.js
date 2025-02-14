import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import Preview from './Preview';
import CardContainer from './CardContainer';

const Practice = ({
  practiceWordLimit,
  seedPractice,
  words,
  closePractice,
  ...props
}) => {
  const { type } = useParams();
  const subview = type || null;

  useEffect(() => {
    seedPractice(words, practiceWordLimit);
    return () => {
      closePractice();
    };
  }, [seedPractice, words, practiceWordLimit, closePractice]);

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
