import { combineReducers } from 'redux';
import authSlice from './auth/authSlice';

const appReducer = combineReducers({
  auth: authSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === authSlice.actions.logout.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
