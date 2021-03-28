export const EDIT_MEMBER = "EDIT_MEMBER";
export const SET_MEMBER = "SET_MEMBER";
export const REMOVE_MEMBER = "REMOVE_MEMBER";
export const GET_MEMBER = "GET_MEMBER";
export const UPDATE_MEMBER = 'UPDATE_MEMBER';
export const DELETE_MEMBER = "DELETE_MEMBER";
export const editMember = (root, value) => ({
    type: EDIT_MEMBER,
    payload: { root, value }
})
export const setMember = (root, value) => ({
    type: SET_MEMBER,
    payload: { root, value }
})
export const removeMember = root => ({
    type: REMOVE_MEMBER,
    payload: { root }
})
export const getMember = id => ({
    type: GET_MEMBER,
    payload: { id }
})
export const updateMember = member => ({
    type: UPDATE_MEMBER,
    payload: { member }
})

export const deleteMember = id => ({
    type: DELETE_MEMBER,
    payload: { id }
})
