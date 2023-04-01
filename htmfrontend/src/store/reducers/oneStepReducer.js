import * as actionList from "../action/actionList";
const InitialState = {
  oneStep: 0,
  anomalyScore: 0,
  nthStep: 0,
  inValue: 0,
};

export const oneStepReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case actionList.ONE_STEP:
      return { ...state, oneStep: payload };

    case actionList.ANOMALY_SCORE:
      return { ...state, anomalyScore: payload };

    case actionList.NTH_STEP:
      return { ...state, nthStep: payload };
    case actionList.IN_VALUE:
      return { ...state, inValue: payload };
    default:
      return state;
  }
};
