import { DATA_EMPTY } from "store/action/actionList";
import { DATA } from "store/action/actionList";

const initialSate = {
  graphData: [],
};

export const dataReducer = (state = initialSate, { type, payload }) => {
  // console.log(payload, "ssadasdsa");
  switch (type) {
    case DATA:
      return { ...state, graphData: [...state.graphData, payload] };
    case DATA_EMPTY:
      return { ...state, graphData: [] };

    default:
      return state;
  }
};
