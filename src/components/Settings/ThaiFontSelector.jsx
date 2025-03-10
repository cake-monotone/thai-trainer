import React from 'react';
import PropTypes from 'prop-types';
import ThaiFontButton from './ThaiFontButton';

const ThaiFontSelector = ({ heading, fonts, selectedFont, onSelectFont }) => {
  const buttons = fonts.map((font) => (
    <ThaiFontButton
      key={font}
      fontFamily={font}
      disabled={font === selectedFont}
      onClick={() => onSelectFont(font)}
    />
  ));

  return (
    <div className="font-selector">
      <h2>{heading}</h2>
      <div className="fonts">{buttons}</div>
      <div className="example-container">
        <span className="thai-font">เป็นมนุษย์สุดประเสริฐเลิศคุณค่า</span>
      </div>
    </div>
  );
};

ThaiFontSelector.propTypes = {
  heading: PropTypes.string.isRequired,
  fonts: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFonts: PropTypes.string,
  onSelectFont: PropTypes.func,
};

export default ThaiFontSelector;
