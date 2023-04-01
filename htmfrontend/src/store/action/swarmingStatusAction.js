import * as actionList from "./actionList";

export const swarmingStatusAction = (payload) => ({
  type: actionList.SWARMING_STATUS,
  payload,
});
