import * as actionList from "./actionList"

export const setPredictionStatus= (payload)=>({
    type:actionList.STOP_PREDICTION,
    payload
});