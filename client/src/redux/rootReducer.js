import { combineReducers } from 'redux';
import authSlice from './auth/authSlice';
import billSlice from './bill/billSlice';

const appReducer = combineReducers({
  auth: authSlice.reducer,
  bills: billSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === authSlice.actions.logout.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
