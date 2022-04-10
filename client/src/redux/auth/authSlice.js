import { ACCESS_TOKEN } from '@/data/enums/misc';
import { clearCookie } from '@/utils/cookieUtils';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  profile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      const { email } = action.payload;
      state.email = email;
    },
    setProfile: (state, action) => {
      const { profile } = action.payload;
      state.profile = profile;
    },
    logout: (state, action) => {
      clearCookie(ACCESS_TOKEN);
    },
  },
});

export default authSlice;
