import dotProp from 'dot-prop-immutable';
import { SET_MEMBER, EDIT_MEMBER, REMOVE_MEMBER } from '../actions/members';
import { isDeacon, notDeacon, deacon } from '../../utilies/constants';

const initialState = {
    findMember: {
        values: {
            id: ''
        },
        validationMsgs: {
            id: ''
        }
    },
    member: {
        values: {

        },
        validationMsgs: {

        }
    },
    active: [
        { value: false, label: 'inactive' },
        { value: true, label: 'active' }
    ],
    isDeacon: [
        { value: '', label: isDeacon, attr: { disabled: true } },
        { value: false, label: notDeacon },
        { value: true, label: deacon }
    ],
    response: { code: '', status: '' },
    loading: false,
    redirectTo: '',
    noEventsPopup: false
}
const members = (state = initialState, action) => {
    switch (action.type) {
        case EDIT_MEMBER: {
            const { root, value } = action.payload;
            const existValue = dotProp.get(state, root)
            state = dotProp.set(state, root, { ...existValue, ...value })
            return { ...state };
        }

        case SET_MEMBER: {
            const { root, value } = action.payload;
            console.log(root, value);
            state = dotProp.set(state, root, value)
            return { ...state };
        }

        case REMOVE_MEMBER: {
            const { root } = action.payload;
            state = dotProp.delete(state, root)
            return { ...state };
        }
        default:
            return { ...state };
    }
};
export default members;