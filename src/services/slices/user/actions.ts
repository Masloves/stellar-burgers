import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  TRegisterData,
  loginUserApi,
  TLoginData,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie';
import { TUser } from '@utils-types';

export const setUser = createAction<TUser | null>('user/setUser');
export const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

export const login = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const register = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const update = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ password, token }: { password: string; token: string }) => {
    await resetPasswordApi({ password, token });
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (!!getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        dispatch(setUser(response.user));
      } catch {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    dispatch(setIsAuthChecked(true));
  }
);
