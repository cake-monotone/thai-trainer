import React from 'react';
import PropTypes from 'prop-types';

const ConfusionPicker = ({
  confusions,
  visibleConfusion,
  showConfusionByIndex,
}) => {
  let headings = confusions.map((confusion, index) => (
    <li
      key={index}
      className={`thai-font ${index === visibleConfusion ? 'selected' : ''}`}
      onClick={() => showConfusionByIndex(index)}
    >
      {confusion[0]}
    </li>
  ));

  return (
    <nav className="confusion-picker">
      <ol>{headings}</ol>
    </nav>
  );
};

ConfusionPicker.propTypes = {
  confusions: PropTypes.array,
  visibleConfusion: PropTypes.number,
  showConfusionByIndex: PropTypes.func.isRequired,
};

export default ConfusionPicker;
