import { takeLatest, put, delay, select, call } from 'redux-saga/effects';
import { ADD_MEMBER, editBooking, setBooking, GET_EVENTS, POST_BOOKING, DELETE_BOOKING } from '../actions/booking';
import { setCommon } from '../actions/common';
import { validateField } from '../../utilies/memberForm';
import { members, membersValues } from './selectors';
import { axiosInstance } from '../../fetch';
import moment from 'moment';
import { noEventsFound, goOn, noEventsFoundText } from '../../utilies/constants';

const addMember = function* (action) {
    const { id, edit } = action.payload;
    try {
        yield put(setBooking(`loading`, true));
        let member = yield call(() =>
            axiosInstance.get('/churchmember/', { params: { "nationalId": id } }));
        member = member.data
        member.id = member.nationalId || '';
        delete member.nationalId;
        member.name = member.fullName || '';
        delete member.fullName
        console.log(member);

        yield put(setBooking(`loading`, false));
        yield* setMember(member, id, edit)
    } catch (error) {
        console.log(error);

        yield put(setBooking(`loading`, false));
        yield* setMember({ name: '', mobile: '', active: true }, id, edit)
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
                mobile: memberForm.mobile.value,
                active: member.active,
                booking: member.booking
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
                ...member
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
        // const membersIds = yield select(members)
        const members = yield select(membersValues);
        members.map(member => {
            member.nationalId = member.id;
            delete member.id
            member.fullName = member.name
            delete member.name
            return member
        });
        yield put(setCommon(`loadingPage`, true));
        const membersResponse = yield call(() =>
            axiosInstance.put('/churchmember/', { data: members }));
        console.log(membersResponse.data);

        const events = yield call(() =>
            axiosInstance.get('/holymass', {
                params: {
                    isAdmin: false,
                    neededSeats: membersResponse.data.length
                }
            }));
        console.log(events);
        events.data.map(event => {
            event.date = event.date.slice(0, -1);
            return event
        })
        yield put(setBooking(`events.list`, []));
        yield put(setBooking(`events.list`, events.data));
        yield put(setCommon(`loadingPage`, false));
        if (events.data.length) {
            yield put(setBooking(`redirectTo`, 'events'));
            yield put(setBooking(`noEventsPopup`, false))
        } else
            yield put(setBooking(`noEventsPopup`, true))

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


