import {SHOWING} from "../action/actionList";
const InitialState = {
  isShowing: false,
};


export const showingReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case SHOWING:
      return { ...state, isShowing: payload };
    default:
      return state;
  }
};

