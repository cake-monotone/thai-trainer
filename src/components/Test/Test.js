import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import TestSelector from '../TestSelector';
import Quiz from '../Quiz';
import TestResults from '../TestResults';
import { TEST_TYPECURRENT, TEST_TYPEOVERDUE } from '../../services/Leitner';

const Test = ({ isComplete, isSaved, queue, setTestType, clearTest }) => {
    const navigate = useNavigate();
    const { type } = useParams();

    // componentDidMount
    useEffect(() => {
        if (type === 'current') {
            setTestType(TEST_TYPECURRENT) || navigate('/test', { replace: true });
        } else if (type === 'overdue') {
            setTestType(TEST_TYPEOVERDUE) || navigate('/test', { replace: true });
        } else {
            navigate('/test', { replace: true });
        }
    }, [type, setTestType, navigate]);

    // componentDidUpdate
    useEffect(() => {
        if (isSaved) {
            navigate('/progress');
        }
    }, [isSaved, navigate]);

    // componentWillUnmount
    useEffect(() => {
        return () => {
            clearTest();
        };
    }, [clearTest]);

    if (isComplete) return <TestResults />;
    if (queue.length === 0) return <TestSelector />;

    return <Quiz />;
};

Test.propTypes = {
    isComplete: PropTypes.bool,
    isSaved: PropTypes.bool,
    queue: PropTypes.array,
    setTestType: PropTypes.func.isRequired,
    clearTest: PropTypes.func.isRequired,
};

export default Test;
