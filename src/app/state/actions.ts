import { createAction, props } from '@ngrx/store';
import { User,currentUser } from './model';

export const login = createAction('[Auth] Login', props<{ credentials: any; role: 'user' | 'admin' }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ accessToken: string,user:currentUser }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

export const refreshToken = createAction('[Auth] Refresh Token', props<{ role: 'user' | 'admin' }>());
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ accessToken: string }>());
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout', props<{ role: 'user' | 'admin' }>());
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());

export const signup = createAction('[Auth] Signup', props<{ credentials: any }>());
export const signupSuccess = createAction('[Auth] Signup Success', props<{ user: User }>());
export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: any }>());

export const setCurrentUser = createAction('[Auth] Set Current User', props<{ user:currentUser}>());
