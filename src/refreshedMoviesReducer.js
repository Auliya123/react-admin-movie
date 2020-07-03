import { REFRESH_MOVIES_SUCCESS } from "./refreshMovieAction";

export default (previousState = [], action) => {
  const { type, payload } = action;
  if (type === REFRESH_MOVIES_SUCCESS) {
    return { ...payload };
  }
  return previousState;
};