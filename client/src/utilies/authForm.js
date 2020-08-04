import { inputText, arToEngNum, loginFailed } from "./constants";

export const validateField = (type, value) => {
    let result = {
        value
    }

    result.validationMsg = inputText[type + 'Validation'];
    if (result.value)
        result.validationMsg = '';
    return result;
}

export const validateOnSubmit = (username='', password, rightCredentials) => {
    let errorResponse = [];
    if (username.toLowerCase() !== rightCredentials.username || password !== rightCredentials.password)
        errorResponse = [loginFailed];

    return errorResponse;
}








