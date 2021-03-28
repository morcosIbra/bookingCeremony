import { all } from 'redux-saga/effects';
import bookingWatchers from "./booking";
import commonWatchers from "./common";
import membersWatchers from "./members";

export const root = function* root() {
    yield all([
        ...bookingWatchers, ...commonWatchers, ...membersWatchers
    ])
}

