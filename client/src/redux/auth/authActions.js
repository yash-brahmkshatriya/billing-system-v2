import queryString from 'query-string';
import authSlice from './authSlice';
import AUTH_URLS from './authUrls';
import { getErrorMessage, pickFromObject } from '@/utils/generalUtils';
import { setCookie } from '@/utils/cookieUtils';
import { ACCESS_TOKEN } from '@/data/enums/misc';
import { errorNoti, successNoti } from '@/base/Notification/Notification';
import instance from '../apiCalls';

const { actions } = authSlice;

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

export const login = (data) => (dispatch) => {
  let url = AUTH_URLS.LOGIN;
  return instance
    .post(url, data)
    .then((res) => {
      const token = res.data.data.token;
      setCookie(ACCESS_TOKEN, token);
      successNoti('Login Successful!');
      return true;
    })
    .catch((err) => {
      let errMsg = getErrorMessage(err);
      errorNoti(errMsg);
      return false;
    });
};

export const signup = (data) => (dispatch) => {
  let url = AUTH_URLS.SIGNUP;
  return instance
    .post(url, data)
    .then((res) => {
      const token = res.data.data.token;
      setCookie(ACCESS_TOKEN, token);
      return true;
    })
    .catch((err) => {
      let errMsg = getErrorMessage(err);
      errorNoti(errMsg);
      return false;
    });
};

export const me = () => (dispatch) => {
  let url = AUTH_URLS.ME;
  return instance
    .get(url)
    .then((response) => {
      dispatch(actions.setProfile(response.data.data));
    })
    .catch((err) => {
      throw err;
    });
};
