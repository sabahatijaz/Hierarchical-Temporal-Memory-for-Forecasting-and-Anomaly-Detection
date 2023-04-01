import { SPIKE_NOTIFICATION } from "./actionList";

export const addSpike = (categoryName, timeStamp) => ({
  type: SPIKE_NOTIFICATION,
  payload: {
    name: categoryName,
    time: timeStamp,
  },
});
