import {TOKEN} from '../action/actionList'

const initialSate ={
    token:[]
}


export const tokenReducer = (state=initialSate,{type,payload})=>{
    switch (type) {
        case TOKEN:
            let category = payload
            let itemExists = state.token.find(
                (c)=> c === category);
                if(itemExists){
                    return{
                        ...state,
                        token: state.token.map((c)=>
                        c === category ? category : c)
                    };
                }else{
                    return {...state,token: [...state.token,category]};
                }
        default:
            return state;
    }
}