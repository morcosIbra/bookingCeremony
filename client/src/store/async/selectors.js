export const members = store => {
    return Object.keys(store.booking.members.order);
}

export const currentPhaseEnd = store => store.common.currentPhase.end