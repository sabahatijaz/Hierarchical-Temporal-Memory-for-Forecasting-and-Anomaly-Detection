import * as actionList from "../action/actionList";
const InitialState = {};

const predictionStateReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case actionList.PREDICTION_VALUES:
      return { ...state, data: payload };
    default:
      return state;
  }
};

export default predictionStateReducer;
