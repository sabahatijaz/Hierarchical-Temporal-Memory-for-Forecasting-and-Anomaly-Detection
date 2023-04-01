import * as actionList from "../action/actionList";
const InitialState = {
  isLoad: null,
};

const SwarmingStatusReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case actionList.SWARMING_STATUS:
      return { ...state, isLoad: payload };
    default:
      return state;
  }
};

export default SwarmingStatusReducer;
