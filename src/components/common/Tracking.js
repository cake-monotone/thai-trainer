import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { operations } from '../../store';
import { useLocation } from 'react-router-dom';

const Tracking = ({ trackRouteChange }) => {
    const { pathname } = useLocation();
    useEffect(() => {
        trackRouteChange(pathname);
    }, [pathname, trackRouteChange]);

    return null;
};

Tracking.propTypes = {
    trackRouteChange: PropTypes.func.isRequired,
};

export default connect(null, operations)(Tracking);