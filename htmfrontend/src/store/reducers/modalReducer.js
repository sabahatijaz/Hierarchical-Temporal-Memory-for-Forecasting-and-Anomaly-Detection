import * as actionList from '../action/actionList'
const InitialState={
    isOpen:false
}

const  modelOpenReducer = (state=InitialState,{payload,type})=>{
    switch(type){
        case actionList.MODEL:
            return { ...state,isOpen:payload }
        default :
        return state;
    
        }
}

export default modelOpenReducer