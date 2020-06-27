import { sagaFail } from "../../utilies/constants";
import { put, delay } from "redux-saga/effects";
import { setCommon } from "../actions/common";

export const errorHandler = function* () {
    yield put(setCommon(`response`, sagaFail));
    yield delay(5000)
    yield put(setCommon(`response`, ''))
}