
import { takeLatest, put, delay } from 'redux-saga/effects';
import { setBooking } from '../actions/booking';
import { GET_META_DATA, setCommon } from '../actions/common';

const getMetaData = function* () {
    try {
        yield delay(3000)
        const currentPhase = { start: new Date(), end: new Date() };
        const info = {
            title: 'معلومات مهمه',
            home: ['معلومه الاوه معلومه معلومهمعلومه معلومهمعلومهمعلومه معلومهمعلومه', 'وطالمعلومه الثانيه'],
            members: ['معلومه الاوه معلومه معلومهمعلومهمعلومهمعلومهمعلومه معلومه معلومه', 'وطالمعلومه الثانيه'],
            events: ['معلومه الاوه', 'وطالمعلومه الثانيه'],
            checkout: ['معلومه الاوه', 'وطالمعلومه الثانيه']
        };
        yield put(setCommon('currentPhase', currentPhase));
        yield put(setCommon('info', { title: info.title, home: info.home }));
        yield put(setBooking('info', {
            members: info.members, events: info.events,
            checkout: info.checkout
        }));
    } catch (error) {
        yield put(setCommon(`reponse`, { ...error }));
    }

}


const watchers = [
    takeLatest(GET_META_DATA, getMetaData),
]
export default watchers;


