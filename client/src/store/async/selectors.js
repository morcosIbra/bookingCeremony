import { result } from "lodash";

export const members = store => {
    return Object.keys(store.booking.members.order);
}
export const membersValues = store => {
    const members = store.booking.members.values;
    let result = [];
    for (const id in members) {
        if (members.hasOwnProperty(id)) {
            const member = members[id];
            result.push({ id, ...member })
        }
    }
    return result;
}

export const currentPhaseEnd = store => store.common.currentPhase.end