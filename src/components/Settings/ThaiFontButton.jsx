import React from 'react';
import PropTypes from 'prop-types';

const ThaiFontButton = ({ fontFamily, example = 'ไทย', disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={disabled ? 'selected' : null}
      style={{ fontFamily: fontFamily }}
    >
      {example}
    </button>
  );
};

ThaiFontButton.propTypes = {
  fontFamily: PropTypes.string.isRequired,
  example: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
export default ThaiFontButton;
