import { createStore, combineReducers } from 'redux';

import { page } from './reducers';

const reducers = combineReducers({
  page,
});

const store = createStore(reducers);

export default store;