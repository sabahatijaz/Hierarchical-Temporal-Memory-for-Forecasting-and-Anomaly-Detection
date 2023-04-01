import * as actionList from "./actionList";

export const oneStepAction = (payload) => ({
  type: actionList.ONE_STEP,
  payload,
});
export const AnomalyScoreAction = (payload) => ({
  type: actionList.ANOMALY_SCORE,
  payload,
});
export const nthStepAction = (payload) => ({
  type: actionList.NTH_STEP,
  payload,
});

export const inValueAction = (payload) => ({
  type: actionList.IN_VALUE,
  payload,
});
