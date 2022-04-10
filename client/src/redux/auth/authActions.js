import axios from 'axios';
import queryString from 'query-string';
import authSlice from './authSlice';
import AUTH_URLS from './authUrls';
import { getErrorMessage, pickFromObject } from '@/utils/generalUtils';

const { actions } = authSlice;
const baseAPIURL = import.meta.env.VITE_BASE_API_URL;

const instance = axios.create({ baseURL: baseAPIURL });

export const setAuthEmail = (email) => (dispatch) => {
  dispatch(actions.setEmail({ email }));
};

export const checkEmail = (data) => (dispatch) => {
  let url = AUTH_URLS.GET_EMAIL + '?' + queryString.stringify(data);
  return instance
    .get(url)
    .then((res) => {
      dispatch(setAuthEmail(data.email));
      return true;
    })
    .catch((err) => {
      let errMsg = getErrorMessage(err);
      return false;
    });
};
