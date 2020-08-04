import booking from './booking';
import common from './common';
import auth from './auth';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    auth, booking, common
});

export default rootReducer;