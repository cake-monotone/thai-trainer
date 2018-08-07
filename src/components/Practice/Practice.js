import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Card from './Card';
import { say, LANGUAGE_THAI, LANGUAGE_ENGLISH } from '../../services/Voices';

export default class Practice extends Component {
    componentDidMount() {
        const { seedPractice, words, practiceWordLimit } = this.props;
        seedPractice(words, practiceWordLimit);

        this.advance = this.advance.bind(this);
        this.nudge = this.nudge.bind(this);
        this.onKey = this.onKey.bind(this);

        document.addEventListener('keydown', this.onKey);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKey);
    }
    advance(direction) {
        this.props.advancePractice(direction);
    }
    nudge() {
        this.props.nudgePractice(this.props.practiceAllAtOnce);
    }
    onKey({code}) {
        if ((code === 'Space' || code === 'ArrowDown')) this.nudge();
        else if (code === 'ArrowRight') this.advance(1);
        else if (code === 'ArrowLeft' || code === 'ArrowUp') this.advance(-1);
    }
    render() {
        const { changeView, pronunciationType, queue, currentIndex, currentStage, practiceAllAtOnce, practiceOrder } = this.props;
        const word = queue[currentIndex];

        if (!word) return null;
        if (practiceAllAtOnce || practiceOrder[currentStage] === 'pronunciation') setTimeout(() => say(LANGUAGE_THAI, word.thai), 500);
        if (practiceAllAtOnce || practiceOrder[currentStage] === 'term') setTimeout(() => say(LANGUAGE_ENGLISH, word.term));

        const card = (<CSSTransition key={word.id} timeout={500} classNames="card">
            <Card word={ queue[currentIndex] } stage={ currentStage } onClick={ this.nudge } pronunciationType={pronunciationType} practiceAllAtOnce={ practiceAllAtOnce } practiceOrder={ practiceOrder } />
        </CSSTransition>);

        return (<div className="practice">
            <button className="back-button" onClick={ () => changeView('navigation') }>Back</button>
            <h1>Practice</h1>
            <TransitionGroup className="container">{ card }</TransitionGroup>
        </div>);
    }
}

Practice.propTypes = {
    currentIndex: PropTypes.number.isRequired,
    currentStage: PropTypes.number.isRequired,
    practiceAllAtOnce: PropTypes.bool.isRequired,
    practiceOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    practiceWordLimit: PropTypes.number.isRequired,
    pronunciationType: PropTypes.string.isRequired,
    queue: PropTypes.array.isRequired,
    words: PropTypes.array.isRequired,

    advancePractice: PropTypes.func.isRequired,
    nudgePractice: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired,
    closePractice: PropTypes.func.isRequired,
    seedPractice: PropTypes.func.isRequired,
};