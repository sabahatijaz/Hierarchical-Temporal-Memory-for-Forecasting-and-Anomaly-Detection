import { PREDICTION_VALUES } from "./actionList";

export const predictionState = (payload) => ({
  type: PREDICTION_VALUES,
  payload,
});
