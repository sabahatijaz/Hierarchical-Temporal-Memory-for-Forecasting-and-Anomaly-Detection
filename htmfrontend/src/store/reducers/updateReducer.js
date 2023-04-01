import * as actionList from "../action/actionList";
const InitialState = {};

export const updateReducer = (state = InitialState, { payload, type }) => {
  switch (type) {
    case actionList.UPDATE_PREDICTION:
      return { ...state, payload };
    default:
      return state;
  }
};
