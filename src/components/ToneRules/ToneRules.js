import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Review from './Review';
import Drill from './Drill';
import NotFound from '../NotFound';

const ToneRules = (props) => {
  const { initializeTones, tonesmap } = props;

  const { stage } = useParams();
  if (stage !== undefined && !/^\d$/.test(stage)) {
    return <NotFound />;
  }

  useEffect(() => {
    initializeTones();
  }, [initializeTones]);
  return (
    <div className="tone-rules">
      {stage === undefined ? <Review {...props} /> : null}
      {stage && tonesmap.length ? (
        <Drill {...props} stage={parseInt(stage, 10)} />
      ) : null}
    </div>
  );
};

ToneRules.propTypes = {
  initializeTones: PropTypes.func.isRequired,
  tonesmap: PropTypes.array.isRequired,
};

export default ToneRules;
