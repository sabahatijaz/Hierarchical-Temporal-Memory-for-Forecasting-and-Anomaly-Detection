import * as actionList from "./actionList";

export const loadingAction = (payload) => ({
  type: actionList.LOADING,
  payload,
});
