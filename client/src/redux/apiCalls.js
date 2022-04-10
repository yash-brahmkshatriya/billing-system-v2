import axios from 'axios';
import { ACCESS_TOKEN } from '@/data/enums/misc';
import { getCookie } from '@/utils/cookieUtils';

const baseAPIURL = import.meta.env.VITE_BASE_API_URL;

const instance = axios.create({ baseURL: baseAPIURL });

instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie(ACCESS_TOKEN);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
