import * as actionList from '../action/actionList'
const InitialState={
}

export const  singleCommError = (state=InitialState,{payload,type})=>{
    switch(type){
        case actionList.COMMERROR:
            return { ...state,commerror:payload }
        default :
        return state;
    
        }
}

export default singleCommError