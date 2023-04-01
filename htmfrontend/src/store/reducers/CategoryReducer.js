import * as actionList from '../action/actionList'
const InitialState={
}

export default  (state=InitialState,{payload,type})=>{
    switch(type){
        case actionList.CATEGORY:
            return { ...state,category:payload }
        default :
        return state;
    
        }
}

// export default singleCategoryReducer