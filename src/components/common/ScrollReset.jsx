import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ScrollReset = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return children;
};

ScrollReset.propTypes = {
  children: PropTypes.node,
};

export default ScrollReset;
