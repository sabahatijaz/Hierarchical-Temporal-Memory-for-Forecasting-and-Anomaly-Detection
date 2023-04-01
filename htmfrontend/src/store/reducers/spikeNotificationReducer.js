import { SPIKE_NOTIFICATION } from "store/action/actionList";

const initialSate = {
  spikes: [],
};

export const spikesNotificationReducer = (
  state = initialSate,
  { type, payload }
) => {
  switch (type) {
    case SPIKE_NOTIFICATION:
      return { ...state, spikes: [...state.spikes, payload] };

    default:
      return state;
  }
};
