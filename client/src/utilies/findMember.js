import { inputText, arToEngNum } from "./constants";

export const validateOnFindMember = (id, validationMsg)=>{
    let result = {
        validationMsg: validationMsg || '',
        value: ''
    }
    if (!id)
        result.validationMsg = inputText.id;
    else result.value = arToEngNum(id)
    return result;
}

export const validateOnUpdateMember = (validationMsgs) => {
    const fields=Object.keys(validationMsgs)
    let valid=true;
    let index=0;
    while(valid&&index<=fields.length){
        valid = validationMsgs[fields[index]]?false:true
        index++;
    }
    return valid;
}






