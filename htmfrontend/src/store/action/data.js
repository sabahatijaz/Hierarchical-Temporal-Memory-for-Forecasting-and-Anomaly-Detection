import { DATA, DATA_EMPTY } from "./actionList";

export const setData = (payload, timeStmp) => ({
  type: DATA,
  payload: {
    AnomalyScore: payload.AnomalyScore,
    CategoryID: payload.CategoryID,
    InValue: payload.InValue,
    IsDayPersistence: payload.IsDayPersistence,
    IsPersistence: payload.IsPersistence,
    IsSwarming: payload.IsSwarming,
    OneStep: payload.OneStep,
    RecordNumber: payload.RecordNumber,
    Spike: payload.Spike,
    SwarmingStatus: payload.SwarmingStatus,
    nthStep: payload.nthStep,
    timeStmp: timeStmp,
  },
});

export const emptyData = () => ({
  type: DATA_EMPTY,
});
