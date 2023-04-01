import * as actionList from "./actionList"

export const setSwarmingStatus= (payload)=>({
    type:actionList.SWARMING,
    payload
});

export const setPersistenceStatus = (payload)=>({
    type:actionList.PERSISTENCE,
    payload
})

export const setPersistanceAtDayEnd = (payload)=>({
    type:actionList.PERSISTENCE_AT_DAY_END,
    payload
})