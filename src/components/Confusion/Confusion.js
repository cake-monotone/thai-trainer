import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ConfusionPicker from './ConfusionPicker';
import ConfusionDetail from './ConfusionDetail';
import Drill from './Drill';
import { useParams } from 'react-router-dom';

const Confusion = (props) => {
  const { initializeConfusion, clearSounds } = props;
  useEffect(() => {
    initializeConfusion();

    return () => {
      clearSounds();
    };
  }, [initializeConfusion, clearSounds]);

  const params = useParams();

  const {
    confusions,
    visibleConfusion,
    showConfusionByIndex,
    confusionLoaded,
  } = props;

  if (confusions.length === 0) return null;
  if (!isNaN(params.visibleConfusion)) {
    return <Drill params={params} {...props} />;
  }

  return (
    <div className="confusion">
      <h1>Easily confused consonants</h1>
      <ConfusionPicker
        confusions={confusions}
        visibleConfusion={visibleConfusion}
        showConfusionByIndex={showConfusionByIndex}
      />

      {confusionLoaded ? <ConfusionDetail {...props} /> : null}
    </div>
  );
};

Confusion.propTypes = {
  confusionLoaded: PropTypes.bool.isRequired,
  confusions: PropTypes.array,
  visibleConfusion: PropTypes.number,

  clearSounds: PropTypes.func.isRequired,
  initializeConfusion: PropTypes.func.isRequired,
  showConfusionByIndex: PropTypes.func.isRequired,
};
export default Confusion;
