import * as actionList from '../action/actionList'
const InitialState={
}

export const  singleReloadReducer = (state=InitialState,{payload,type})=>{
    switch(type){
        case actionList.RELOAD:
            return { ...state,reload:payload }
        default :
        return state;
    
        }
}

export default singleReloadReducer