import { createAction, props } from '@ngrx/store';
import { User } from './model';

export const fetchUsers = createAction('[Admin] Fetch Users');
export const fetchUsersSuccess = createAction('[Admin] Fetch Users Success', props<{ users: User[] }>());
export const fetchUsersFailure = createAction('[Admin] Fetch Users Failure', props<{ error: any }>());

export const updateUser = createAction('[Admin] Update User', props<{user:User}>());
export const updateUserSuccess = createAction('[Admin] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[Admin] Update User Failure', props<{ error: any }>());

export const deleteUser = createAction('[Admin] Delete User', props<{user:User}>());
export const deleteUserSuccess = createAction('[Admin] Delete User Success');
export const deleteUserFailure = createAction('[Admin] Delete User Failure', props<{error:any}>());