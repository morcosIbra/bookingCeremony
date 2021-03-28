export const EDIT_AUTH = "EDIT_AUTH";
export const SET_AUTH = "SET_AUTH";
export const REMOVE_AUTH = "REMOVE_AUTH";

export const editAuth = (root, value) => ({
    type: EDIT_AUTH,
    payload: { root, value }
})
export const setAuth = (root, value) => ({
    type: SET_AUTH,
    payload: { root, value }
})
export const removeAuth = root => ({
    type: REMOVE_AUTH,
    payload: { root }
})


