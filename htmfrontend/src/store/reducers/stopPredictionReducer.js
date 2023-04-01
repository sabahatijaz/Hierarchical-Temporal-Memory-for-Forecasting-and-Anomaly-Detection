import * as actionList from '../action/actionList'
const InitialState={
    isStop:false
}

const  stopPredictionReducer = (state=InitialState,{payload,type})=>{
    switch(type){
        case actionList.STOP_PREDICTION:
            return { ...state,isStop:payload }
        default :
        return state;
    
        }
}

export default stopPredictionReducer;