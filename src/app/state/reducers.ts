import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';
import * as AdminActions from './admin.actions';
import { AuthState,AdminState } from './model';

export const initialState: AuthState = {
    user:null,
    users:[],
    role:null,
    accessToken: null,
    error: null,
    loading: false,
};
export const initialAdminState:AdminState={
    users:[],
    error:null,
}

export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
    on(AuthActions.loginSuccess, (state, { accessToken,user }) => ({ ...state, accessToken,user,error:null,role: user.isAdmin ? 'admin' as const : 'user' as const, loading: false })),
    on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
    
    on(AuthActions.refreshToken, (state) => ({ ...state, loading: true, error: null })),
    on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({ ...state, accessToken, loading: false })),
    on(AuthActions.refreshTokenFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(AuthActions.logout, (state) => ({...state, loading: true, error: null})),
    on(AuthActions.logoutSuccess, (state) => ({...state, accessToken: null, loading: false})),
    on(AuthActions.logoutFailure, (state, {error}) => ({...state, error, loading: false})),

    on(AuthActions.signup, (state) => ({ ...state, loading: true, error: null })),
    on(AuthActions.signupSuccess, (state, { user }) => ({ ...state,user:{ ...user, isAdmin: false }, loading: false })),
    on(AuthActions.signupFailure, (state, { error }) => ({ ...state, error, loading: false })),
);

export const adminReducer = createReducer(
    initialAdminState,
    on(AdminActions.fetchUsersSuccess, (state, { users})=>({...state,users,error:null})),
    on(AdminActions.fetchUsersFailure, (state, { error})=>({...state,error})),

    on(AdminActions.updateUserSuccess, (state, {user})=>({...state,users:state.users.map(u=>u.email===user.email ? user : u)})),
    on(AdminActions.updateUserFailure, (state,{error})=>({...state,error})),

    on(AdminActions.deleteUserSuccess, (state)=> ({...state})),
    on(AdminActions.deleteUserFailure, (state,{error})=>({...state,error}))
);
