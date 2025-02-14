import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { operations } from './store';
import ScrollReset from './components/common/ScrollReset';
import Loading from './components/Loading';
import Breadcrumb from './components/Navigation/Breadcrumbs';
import MainNavigation from './components/Navigation/MainNavigation';
import NavigationBasics from './components/Navigation/BasicsNavigation';
import ConsonantNavigation from './components/Navigation/ConsonantNavigation';
import TonesNavigation from './components/Navigation/ToneNavigation';
import Progress from './components/Progress';
import Settings from './components/Settings';
import Practice from './components/Practice';
import Test from './components/Test';
import TestSelector from './components/TestSelector';
import Vowels from './components/Vowels';
import Consonants from './components/Consonants';
import Confusion from './components/Confusion';
import ConsonantClasses from './components/ConsonantClasses';
import ToneRules from './components/ToneRules';
import Tracking from './components/common/Tracking';
import NotFound from './components/NotFound';

import './styles/css/App.css';
import 'rc-slider/assets/index.css';

class App extends Component {
  async componentDidMount() {
    const { initializeWordsManager, initializeVoiceManager, initializeSettings, setApplicationReady } = this.props;

    await Promise.all([
      initializeVoiceManager(),
      initializeWordsManager(),
      initializeSettings(),
    ])
    .then(() => setApplicationReady());
  }
  render() {
    if (!this.props.applicationReady) return <Loading />;

    return <Router>
      <ScrollReset>
        <Breadcrumb />
        <Routes>
          <Route path="*" element={<Tracking/>} />
          <Route path="/" element={<MainNavigation />} />
          <Route path="/basics" element={<NavigationBasics /> } />
          <Route path='/basics/vowels' element={<Vowels/>} />
          <Route path='/basics/consonants' element={<ConsonantNavigation/>} />
          <Route path='/basics/consonants/confusion/drill-:visibleConfusion(\d)' element={<Confusion/>} />
          <Route path="/basics/consonants/review" element={<Consonants/>} />
          <Route path='/basics/consonants/confusion' element={<Confusion/>} />
          <Route path="/basics/tones" element={<TonesNavigation/>} />
          <Route path="/basics/tones/classes" element={<ConsonantClasses/>} />
          <Route path="/basics/tones/classes/drill/:type(all|mid-high)" element={<ConsonantClasses/>} />
          <Route path="/basics/tones/rules" element={<ToneRules/>} />
          <Route path="/basics/tones/rules/drill/:stage(\d+)" element={<ToneRules/>} />

          <Route path='/progress' element={<Progress/>} />
          <Route path='/practice/:type?' element={<Practice/>} />
          <Route path='/test' element={<TestSelector/>} />
          <Route path='/test/:type(overdue|current)' element={<Test/>} />

          <Route path="/settings" element={<Settings/>} />
          <Route element={<NotFound/>} />
        </Routes>
      </ScrollReset>
    </Router>;
  }
}

App.propTypes = {
  applicationReady: PropTypes.bool.isRequired,
  initializeWordsManager: PropTypes.func.isRequired,
  initializeSettings: PropTypes.func.isRequired,
  initializeVoiceManager: PropTypes.func.isRequired,
  setApplicationReady: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  applicationReady: state.view.applicationReady,
});

export default connect(mapStateToProps, operations)(App);
