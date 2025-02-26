import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './model';
import { AdminState } from './model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAdminState = createFeatureSelector<AdminState>('admin');


export const selectAccessToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.accessToken
);

export const selectCurrentUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user
);

export const selectAuthRole = createSelector(
    selectAuthState,
    (state: AuthState) => state.role
);

export const selectAuthUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state: AuthState) => state.error
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state: AuthState) => state.loading
);

export const selectIsLoggedIn = createSelector(
    selectAccessToken,
    (accessToken) => !!accessToken
);

export const selectAllUsers = createSelector(
    selectAdminState,
    (state:AdminState)=> state.users 
);

export const selectSingleUser = createSelector(
    selectAdminState,
    (state:AdminState,props:{email:string})=> state.users.find(user=>user.email===props.email)
);