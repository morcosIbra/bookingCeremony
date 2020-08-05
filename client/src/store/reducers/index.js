import booking from './booking';
import common from './common';
import auth from './auth';
import members from './members';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    auth, booking, common, members
});

export default rootReducer;