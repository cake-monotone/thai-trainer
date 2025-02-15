import { combineReducers, applyMiddleware, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import { reducer as view, operations as viewOperations } from './view';
import { reducer as voice, operations as voiceOperations } from './voice';
import {
  reducer as settings,
  operations as settingsOperations,
} from './settings';
import { reducer as words, operations as wordOperations } from './words';
import { reducer as test, operations as testOperations } from './tests';
import { reducer as sounds, operations as soundsOperations } from './sounds';
import { reducer as tones, operations as tonesOperations } from './tones';
import {
  middleware as trackingMiddleware,
  operations as trackingOperations,
} from './tracking';

const rootReducer = combineReducers({
  view,
  voice,
  settings,
  words,
  test,
  sounds,
  tones,
});

let enhancers = [];
const middleware = [trackingMiddleware, thunk];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers = [...enhancers, devToolsExtension()];
  }
}
const rootEnhancer = compose(applyMiddleware(...middleware), ...enhancers);

const store = configureStore({
  reducer: rootReducer,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(rootEnhancer),
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({ serializableCheck: false }),
});

export const operations = {
  ...viewOperations,
  ...voiceOperations,
  ...settingsOperations,
  ...wordOperations,
  ...testOperations,
  ...soundsOperations,
  ...tonesOperations,
  ...trackingOperations,
};

export default store;
