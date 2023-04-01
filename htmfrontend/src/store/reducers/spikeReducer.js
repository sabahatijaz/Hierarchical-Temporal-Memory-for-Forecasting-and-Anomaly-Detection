import * as actionList from "../action/actionList";
const InitialState = {
  spike2: null,
};

const spikeReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case actionList.SPIKE:
      return { ...state, spike2: payload };
    default:
      return state;
  }
};

export default spikeReducer;
