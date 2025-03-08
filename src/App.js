import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
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

const RouteRoot = () => {
  return (
    <>
      <Tracking />
      <Outlet />
    </>
  );
};

class App extends Component {
  async componentDidMount() {
    const {
      initializeWordsManager,
      initializeVoiceManager,
      initializeSettings,
      setApplicationReady,
    } = this.props;

    await Promise.all([
      initializeVoiceManager(),
      initializeWordsManager(),
      initializeSettings(),
    ]).then(() => setApplicationReady());
  }
  render() {
    if (!this.props.applicationReady) return <Loading />;

    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollReset>
          <Breadcrumb />
          <Routes>
            <Route path="/" element={<RouteRoot />}>
              <Route index element={<MainNavigation />} />

              <Route path="basics">
                <Route index element={<NavigationBasics />} />
                <Route path="vowels" element={<Vowels />} />

                <Route path="consonants">
                  <Route index element={<ConsonantNavigation />} />
                  <Route path="review" element={<Consonants />} />
                  <Route path="confusion" element={<Confusion />} />
                  <Route
                    path="confusion/drill/:visibleConfusion"
                    element={<Confusion />}
                  />
                </Route>

                <Route path="tones">
                  <Route index element={<TonesNavigation />} />
                  <Route path="classes" element={<ConsonantClasses />} />
                  <Route
                    path="classes/drill/:type"
                    element={<ConsonantClasses />}
                  />
                  <Route path="rules" element={<ToneRules />} />
                  <Route path="rules/drill/:stage" element={<ToneRules />} />
                </Route>
              </Route>

              <Route path="/progress" element={<Progress />} />
              <Route path="/practice/:type?" element={<Practice />} />
              <Route path="/test" element={<TestSelector />} />
              <Route path="/test/:type" element={<Test />} />

              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ScrollReset>
      </Router>
    );
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
