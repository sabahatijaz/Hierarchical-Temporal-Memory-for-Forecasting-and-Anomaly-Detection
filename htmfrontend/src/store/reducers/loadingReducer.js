import * as actionList from "../action/actionList";
const InitialState = {
  isLoading: false,
};

const loadingReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case actionList.LOADING:
      return { ...state, isLoading: payload };
    default:
      return state;
  }
};

export default loadingReducer;
