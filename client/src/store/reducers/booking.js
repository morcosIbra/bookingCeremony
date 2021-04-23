import dotProp from 'dot-prop-immutable';
import { SET_BOOKING, EDIT_BOOKING, REMOVE_BOOKING } from '../actions/booking';
import {
    pastHolymasses, comingHolymasses, hamammatElkoba, kobriElkoba, sarayaElkoba, manshetElbakry, zeiton,
    maryAnbamousa, other, chooseRegion, chooseCeremony, holymasses, eveningPrayers, paschas
} from '../../utilies/constants';

const initialState = {
    info: {
        members: [],
        events: [],
        checkout: []
    },
    member: {
        values: {
            id: '',
            ceremony:''
        },
        validationMsgs: {
            id: '',
            ceremony:''
        }
    },
    members: {
        values: {},
        validationMsgs: {},
        order: {}
    },
    pastEvents: [
        { value: false, label: comingHolymasses },
        { value: true, label: pastHolymasses }],
    regions: [
        { value: chooseRegion, label: chooseRegion, attr: { disabled: true } },
        { value: hamammatElkoba, label: hamammatElkoba },
        { value: kobriElkoba, label: kobriElkoba },
        { value: sarayaElkoba, label: sarayaElkoba },
        { value: manshetElbakry, label: manshetElbakry },
        { value: zeiton, label: zeiton },
        { value: maryAnbamousa, label: maryAnbamousa },
        { value: other, label: other }
    ],
    ceremonies: [
        { value: '', label: chooseCeremony, attr: { disabled: true } },
        { value: 'holymass', label: holymasses },
        { value: 'eveningPrayer', label: eveningPrayers },
        { value: 'pascha', label: paschas }
    ],
    events: {
        values: {
            selected: ''
        },
        validationMsg: '',
        list: [],
        loading: false
    },
    footer: {
        leftButton: '',
        rightButton: ''
    },
    response: { code: '', status: '' },
    loading: false,
    redirectTo: '',
    noEventsPopup: false
}
const booking = (state = initialState, action) => {
    switch (action.type) {
        case EDIT_BOOKING: {
            const { root, value } = action.payload;
            const existValue = dotProp.get(state, root)
            state = dotProp.set(state, root, { ...existValue, ...value })
            return { ...state };
        }

        case SET_BOOKING: {
            const { root, value } = action.payload;
            state = dotProp.set(state, root, value)
            return { ...state };
        }

        case REMOVE_BOOKING: {
            const { root } = action.payload;
            state = dotProp.delete(state, root)
            return { ...state };
        }
        
        default:
            return { ...state };
    }
};
export default booking;