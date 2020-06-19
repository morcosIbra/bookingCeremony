import { takeLatest, put, delay, select } from 'redux-saga/effects';
import { ADD_MEMBER, editBooking, setBooking, GET_EVENTS, POST_BOOKING, DELETE_BOOKING } from '../actions/booking';
import { setCommon } from '../actions/common';
import { validateField } from '../../utilies/memberForm';
import { members } from './selectors';

const addMember = function* (action) {
    try {
        const { id, edit } = action.payload;
        const dateObj = new Date();
        yield put(setBooking(`loading`, true));
        yield delay(3000)
        const member = {
            id,
            active: true,
            name: '', mobile: ''
            , booking: {
                id: '20',
                date: dateObj.setDate(dateObj.getDate() + 1)
            }
        }
        yield put(setBooking(`loading`, false));
        yield* setMember(member, id, edit)
    } catch (error) {
        yield put(setCommon(`loading`, false));
        yield put(setCommon(`reponse`, { ...error }));
    }

}

const setMember = function* (member, id, edit) {
    if (edit) {
        const memberForm = {
            name: validateField('name', member.name),
            mobile: validateField('mobile', member.mobile)
        }
        const membersIds = yield select(members)
        yield put(editBooking(`members.values`, {
            [id]: {
                name: memberForm.name.value,
                mobile: memberForm.mobile.value
            }
        }));
        yield put(editBooking(`members.order`, {
            [id]: membersIds.length
        }));
        yield put(editBooking(`members.validationMsgs`, {
            [id]: {
                name: memberForm.name.validationMsg,
                mobile: memberForm.mobile.validationMsg
            }
        }));

    } else {
        yield put(editBooking(`members.values`, {
            [id]: {
                ...member,
                name: 'بيشوي باهر متي عبد المسيح',
                mobile: '01201211236'
            }
        }));
        const membersIds = yield select(members)
        yield put(editBooking(`members.order`, {
            [id]: membersIds.length
        }));
    }


}
const getEvents = function* () {
    try {
        const membersIds = yield select(members)
        const membersLength = membersIds.length
        yield put(setBooking(`events.list`, []));
        yield put(setCommon(`loadingPage`, true));
        yield delay(3000)
        const dateObj = new Date();
        const events = [
            {
                id: 'id1', date: dateObj.setDate(dateObj.getDate() + 5),
                seats: 10
            }, {
                id: 'id2', date: dateObj.setDate(dateObj.getDate() + 4),
                seats: 1
            }, {
                id: 'id3', date: dateObj.setDate(dateObj.getDate() + 1),
                seats: 2
            }, {
                id: 'id4', date: dateObj.setDate(dateObj.getDate() + 8),
                seats: 3
            }, {
                id: 'id5', date: dateObj.setDate(dateObj.getDate() + 9),
                seats: 11
            }, {
                id: 'id6', date: dateObj.setDate(dateObj.getDate() + 1),
                seats: 70
            }
        ]
        yield put(setBooking(`events.list`, events));
        yield put(setCommon(`loadingPage`, false));
        yield put(setBooking(`redirectTo`, 'events'));
    } catch (error) {
        yield put(setCommon(`loadingPage`, false));
        yield put(setCommon(`reponse`, { ...error }));
    }

}
const postBooking = function* (action) {
    try {
        const { eventId } = action.payload;
        const memberIds = yield select(members)
        const data = memberIds.map(memberId => {
            return { memberId, eventId }
        })
        yield put(setCommon(`loadingPage`, true));
        yield delay(3000)
        const response = memberIds.map(memberId => {
            return { memberId, bookingId: 20, date: new Date() }
        })

        for (let index = 0; index < response.length; index++) {
            const book = response[index];
            yield put(editBooking(`members.values.${book.memberId}.booking`, {
                date: book.date, id: book.bookingId
            }));
        }
        yield put(setBooking(`redirectTo`, 'checkout'));
        yield put(setCommon(`loadingPage`, false));
    } catch (error) {
        yield put(setCommon(`loadingPage`, false));
        yield put(setCommon(`reponse`, { ...error }));
    }
}
const deleteBooking = function* (action) {
    try {
        const { id } = action.payload;
        yield put(setCommon(`loadingPage`, true));
        yield delay(3000)
        yield put(setBooking(`members.order`, {}))
        yield put(setBooking(`members.values`, {}))
        yield put(setCommon(`loadingPage`, false));
    } catch (error) {
        yield put(setCommon(`loadingPage`, false));
        yield put(setCommon(`reponse`, { ...error }));
    }
}
const watchers = [
    takeLatest(ADD_MEMBER, addMember),
    takeLatest(GET_EVENTS, getEvents),
    takeLatest(POST_BOOKING, postBooking),
    takeLatest(DELETE_BOOKING, deleteBooking)
]
export default watchers;


