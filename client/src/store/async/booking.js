import { takeLatest, put, delay, select, call } from 'redux-saga/effects';
import { ADD_MEMBER, editBooking, setBooking, GET_EVENTS, POST_BOOKING, DELETE_BOOKING } from '../actions/booking';
import { setCommon } from '../actions/common';
import { validateField } from '../../utilies/memberForm';
import { members, membersValues } from './selectors';
import { axiosInstance } from '../../fetch';

const addMember = function* (action) {
    const { id, edit } = action.payload;
    try {
        const dateObj = new Date();
        yield put(setBooking(`loading`, true));
        // yield delay(3000)
        let member = yield call(() =>
            axiosInstance.get('/churchmember/', { params: { "nationalId": id } }));
        member = member.data
        member.id = member.nationalId || '';
        delete member.nationalId;
        member.name = member.fullName || '';
        delete member.fullName
        yield put(setBooking(`loading`, false));
        yield* setMember(member, id, edit)
    } catch (error) {
        console.log(error);

        yield put(setBooking(`loading`, false));
        yield* setMember({ name: '', mobile: '' }, id, edit)
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
        // const membersIds = yield select(members)
        const members = yield select(membersValues);
        members.map(member => {
            member.nationalId = member.id;
            delete member.id
            member.fullName = member.name
            delete member.name
            return member
        })
        const membersResponse = yield call(() =>
            axiosInstance.put('/churchmember/', { data: members }));
        // yield put(setBooking(`members.order`, {}))
        // yield put(setBooking(`members.values`, {}))
        // for (let index = 0; index < membersResponse.data.length; index++) {
        //     const member = membersResponse.data[index];
        //     const id = member.nationalId || '';
        //     delete member.nationalId;
        //     member.name = member.fullName || '';
        //     delete member.fullName
        //     yield* setMember(member, id, true)
        // }
        // membersResponse.data.map(member => {
        //     const id = member.nationalId || '';
        //     delete member.nationalId;
        //     member.name = member.fullName || '';
        //     delete member.fullName
        //     yield * setMember(member, id, true)
        // })
        // const membersLength = membersResponse.length
        // yield put(setBooking(`events.list`, []));
        // yield put(setCommon(`loadingPage`, true));
        // yield delay(3000)
        // const dateObj = new Date();
        // const events = [
        //     {
        //         id: 'id1', date: dateObj.setDate(dateObj.getDate() + 5),
        //         seats: 10
        //     }, {
        //         id: 'id2', date: dateObj.setDate(dateObj.getDate() + 4),
        //         seats: 1
        //     }, {
        //         id: 'id3', date: dateObj.setDate(dateObj.getDate() + 1),
        //         seats: 2
        //     }, {
        //         id: 'id4', date: dateObj.setDate(dateObj.getDate() + 8),
        //         seats: 3
        //     }, {
        //         id: 'id5', date: dateObj.setDate(dateObj.getDate() + 9),
        //         seats: 11
        //     }, {
        //         id: 'id6', date: dateObj.setDate(dateObj.getDate() + 1),
        //         seats: 70
        //     }
        // ]
        // yield put(setBooking(`events.list`, events));
        // yield put(setCommon(`loadingPage`, false));
        // yield put(setBooking(`redirectTo`, 'events'));
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


