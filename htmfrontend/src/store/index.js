import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import modelOpenReducer from "./reducers/modalReducer";
import {
  swarmingReducer,
  persistanceReducer,
} from "./reducers/swarmingPersistance";
import stopPredictionReducer from "./reducers/stopPredictionReducer";
import { categoryReducer } from "./reducers/categoriesReducer";
import thunk from "redux-thunk";
import singleCategoryReducer from "./reducers/CategoryReducer";
import predictionStateReducer from "./reducers/predictionState";
import { tokenReducer } from "./reducers/tokenReducer";
import SwarmingStatusReducer from "./reducers/swarmingStatusReducer";
import { dataReducer } from "./reducers/dataReducer";
import { updateReducer } from "./reducers/updateReducer";
import spikeReducer from "./reducers/spikeReducer";
import {showingReducer} from "./reducers/showingReducer";
import { oneStepReducer } from "./reducers/oneStepReducer";
import { spikesNotificationReducer } from "./reducers/spikeNotificationReducer";
import { singleReloadReducer } from "./reducers/ReloadReducer"
import { loadState, saveState } from "./sessionStorage";
import loadingReducer from "./reducers/loadingReducer";
import {singleCommError} from "./reducers/CommErrorReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
  showing: showingReducer,
  modalOpen: modelOpenReducer,
  swarming: swarmingReducer,
  persistance: persistanceReducer,
  stopPrediction: stopPredictionReducer,
  categories: categoryReducer,
  category: singleCategoryReducer,
  reload: singleReloadReducer,
  commerror:singleCommError,
  predict: predictionStateReducer,
  token: tokenReducer,
  swarmingStatus: SwarmingStatusReducer,
  data: dataReducer,
  update: updateReducer,
  spike2: spikeReducer,
  oneStep: oneStepReducer,
  spikesNotification: spikesNotificationReducer,
  loading: loadingReducer,
  
  
});

let categoriesFromStorage = loadState();

const persistedState = {
  categories: {
    categories: categoriesFromStorage,
  },
};

const MainStore = createStore(
  reducer,
  // persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

MainStore.subscribe(() => {
  saveState(MainStore.getState().categories.categories);
});

export default MainStore;
