import dotProp from 'dot-prop-immutable';
import { SET_BOOKING, EDIT_BOOKING, REMOVE_BOOKING } from '../actions/booking';
import { hamammatElkoba, kobriElkoba, sarayaElkoba, manshetElbakry, zeiton, maryAnbamousa, other } from '../../utilies/constants';

const initialState = {
    info: {
        members: [],
        events: [],
        checkout: []
    },
    member: {
        values: {
            id: ''
        },
        validationMsgs: {
            id: ''
        }
    },
    members: {
        values: {},
        validationMsgs: {},
        order: {}
    },
    regions: [
        { key: 'hamammatElkoba', value: hamammatElkoba },
        { key: 'kobriElkoba', value: kobriElkoba },
        { key: 'sarayaElkoba', value: sarayaElkoba },
        { key: 'manshetElbakry', value: manshetElbakry },
        { key: 'zeiton', value: zeiton },
        { key: 'maryAnbamousa', value: maryAnbamousa },
        { key: 'other', value: other }
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