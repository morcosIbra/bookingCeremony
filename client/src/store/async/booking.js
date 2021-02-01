import { takeLatest, put, select, call } from 'redux-saga/effects';
import { ADD_MEMBER, editBooking, setBooking, addMember as addMemberAction, GET_EVENTS, POST_BOOKING, REMOVE_SEAT } from '../actions/booking';
import { setCommon } from '../actions/common';
import { validateField } from '../../utilies/memberForm';
import { members, membersValues, isAdminStore, selectedCeremony } from './selectors';
import { axiosInstance } from '../../fetch';
import { errorHandler } from './errorHandler';

const addMember = function* (action) {
    const { id, edit } = action.payload;
    try {
        yield put(setBooking(`loading`, true));
        let member = yield call(() =>
            axiosInstance.get('/churchmember', { params: { "nationalId": id } }));

        member = member.data;
        member.id = member.nationalId || '';
        delete member.nationalId;
        member.name = member.fullName || '';
        delete member.fullName;
        member.booking = {
            id: member.lastBooking?.bookingId,
            date: member.lastBooking?.date.slice(0, -1),
            description: member.lastBooking?.description
        };
        delete member.lastBooking;
        if (member.lastEveningPrayer) {
            member.lastEveningPrayer.date = member.lastEveningPrayer.date.slice(0, -1)
            member.lastEveningPrayer.id = member.lastEveningPrayer.bookingId;
            delete member.lastEveningPrayer.bookingId;
        }
       yield put(setBooking(`loading`, false));
        yield* setMember(member, id, edit)
    } catch (error) {
        yield put(setBooking(`loading`, false));
        if (error?.response?.status === 404)
            yield* setMember({
                name: '', mobile: '', street: '', building: '', apartment: '', floor: '', region: '',
                isDeacon: '', active: true
            }, id, edit)
        else
            yield* errorHandler()
    }

}

const setMember = function* (member, id, edit) {
    if (edit) {
        const memberForm = {
            name: validateField('name', member.name),
            mobile: validateField('mobile', member.mobile),
            street: validateField('street', member.street),
            building: validateField('building', member.building),
            apartment: validateField('apartment', member.apartment),
            floor: validateField('floor', member.floor),
            region: validateField('region', member.region),
            isDeacon: validateField('isDeacon', member.isDeacon)
        }
        const membersIds = yield select(members)
        yield put(editBooking(`members.values`, {
            [id]: {
                ...member,
                name: memberForm.name.value,
                mobile: memberForm.mobile.value,
                street: memberForm.street.value,
                building: memberForm.building.value,
                apartment: memberForm.apartment.value,
                floor: memberForm.floor.value,
                region: memberForm.region.value,
                isDeacon: memberForm.isDeacon.value,

                //   active: member.active,
                //  booking: member.booking
            }
        }));
        yield put(editBooking(`members.order`, {
            [id]: membersIds.length
        }));
        yield put(editBooking(`members.validationMsgs`, {
            [id]: {
                name: memberForm.name.validationMsg,
                mobile: memberForm.mobile.validationMsg,
                street: memberForm.street.validationMsg,
                building: memberForm.building.validationMsg,
                apartment: memberForm.apartment.validationMsg,
                floor: memberForm.floor.validationMsg,
                region: memberForm.region.validationMsg,
                isDeacon: memberForm.isDeacon.validationMsg
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

const getEvents = function* (action) {
    try {
        const { pastEvents } = action.payload
        const members = yield select(membersValues);
        const ceremony = yield select(selectedCeremony)
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
       for (let index = 0; index < membersResponse.data.length; index++) {
            const member = membersResponse.data[index];
            yield put(editBooking(`members.values.${member.nationalId}`, { _id: member._id }));
        }
        const isAdmin = yield select(isAdminStore);
        let events = null
        if (isAdmin) {
            const startDate = pastEvents == 'true' ? "1900-01-01T00:00:00.000Z" : new Date();
            const endDate = pastEvents == 'true' ? new Date() : "2050-01-01T00:00:00.000Z";
            events = yield call(() =>
                axiosInstance.get(`/${ceremony}/search`, {
                    params: {
                        startDate,
                        endDate
                    }
                }));
        } else
            events = yield call(() =>
                axiosInstance.get(`/${ceremony}`, {
                    params: {
                        isAdmin: false,
                        neededSeats: membersResponse.data.length
                    }
                }));
        events.data.map(event => {
            event.date = event.date.slice(0, -1);
            return event
        })
        // yield put(setBooking(`events.list`, []));
        yield put(setBooking(`events.list`, events.data));
        yield put(setCommon(`loadingPage`, false));
        if (events.data.length) {
            yield put(setBooking(`redirectTo`, 'events'));
            yield put(setBooking(`noEventsPopup`, false))
        } else
            yield put(setBooking(`noEventsPopup`, true))

    } catch (error) {
        yield put(setCommon(`loadingPage`, false));
        yield* errorHandler()
    }

}
const postBooking = function* (action) {
    try {
        const { eventId } = action.payload;
        const members = yield select(membersValues);
        const ceremony = yield select(selectedCeremony)
        const idKey = ceremony === 'holymass' ? 'holymassId' : 'id'
        const data = members.map(member => {
            return { memberId: member._id, [idKey]: eventId }
        })
        yield put(setCommon(`loadingPage`, true));

        const bookingRes = yield call(() =>
            axiosInstance.post(`/${ceremony}/bookseat/`, data));
        let values = {};
        for (let index = 0; index < bookingRes.data.length; index++) {
            let record = bookingRes.data[index];
            record.booking.id = record.booking.bookingId;
            record.booking.date = record.booking.date.slice(0, -1);
            record._id = record.memberId;
            record.name = record.fullName;
            delete record.booking.bookingId;
            delete record.memberId;
            delete record.fullName;
            values[record.nationalId] = record;
            delete record.nationalId;
        }
        yield put(setBooking(`members.values`, values));
        yield put(setCommon(`loadingPage`, false));
        yield put(setBooking(`redirectTo`, 'checkout'));
    } catch (error) {
        yield put(setCommon(`loadingPage`, false));

        yield* errorHandler(error.response?.data[0]?.error)
    }
}
const removeSeat = function* (action) {
    try {
        const { memberId, edit, ceremony } = action.payload;
        yield put(setCommon(`loadingPage`, true));

        yield call(() =>
            axiosInstance.post(`/${ceremony}/cancelSeat`, {
                churchMemberId: memberId
            }));
        if (edit) {
            const members = yield select(membersValues);
            yield put(setBooking(`members.order`, {}))
            yield put(setBooking(`members.values`, {}))
            yield put(addMemberAction(members[0].id, false))
        }

        yield put(setCommon(`loadingPage`, false));
    } catch (error) {
        yield put(setCommon(`loadingPage`, false));
        yield* errorHandler()
    }
}
const watchers = [
    takeLatest(ADD_MEMBER, addMember),
    takeLatest(GET_EVENTS, getEvents),
    takeLatest(POST_BOOKING, postBooking),
    takeLatest(REMOVE_SEAT, removeSeat)
]
export default watchers;


