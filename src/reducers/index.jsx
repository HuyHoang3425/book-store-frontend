import { combineReducers } from "redux";
import authReducer from "./auth";

const allReducers = combineReducers({
  authReducer,
});

export default allReducers;
