import { RELOAD} from "./actionList";

export const addReload = (Name) => ({
  type: RELOAD,
  payload: {
    name: Name,
    value: Name,
  },
});
