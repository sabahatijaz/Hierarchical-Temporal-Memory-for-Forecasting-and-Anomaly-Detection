import * as actionList from '../action/actionList'
const InitialState={
    swarming:false,
}

export const  swarmingReducer = (state=InitialState,{payload,type})=>{
    switch(type){
        case actionList.SWARMING:
            return { ...state,swarming:payload }
        default :
        return state;
        }
}

const initialStateP = {
    persistence:false,
    persistenceDayEnd:false
}

export const persistanceReducer = (state=initialStateP,{payload,type})=>{
    switch(type){
        case actionList.PERSISTENCE:
            return {...state,persistence:payload}
        case actionList.PERSISTENCE_AT_DAY_END:
            return {...state, persistenceDayEnd:payload}
            default:
                return state
    }
}
