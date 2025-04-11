import { Injectable,inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap,tap} from 'rxjs/operators';
import * as AuthActions from '../state/actions';
import * as AdminActions from '../state/admin.actions';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthEffects{
    private actions$=inject(Actions);
    private authService=inject(AuthService);
    private router=inject(Router);

    initAuth$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.initAuth),
            switchMap(() => {
                const token = this.authService.getAccessToken();
                console.log('Init effect - Found token:', !!token);
                
                if (token) {
                    // Try to get current user with existing token
                    return this.authService.fetchCurrentUser().pipe(
                        map(user => {
                            console.log('Init effect - User loaded:', user);
                            return AuthActions.loginSuccess({ accessToken: token, user });
                        }),
                        catchError(error => {
                            console.log('Init effect - Error loading user:', error);
                            console.log('Init effect - Trying refresh token');
                            // If token is invalid, try to refresh it
                            return this.authService.refreshAccessToken().pipe(
                                map(newToken => {
                                    this.authService.setAccessToken(newToken);
                                    console.log('Init effect - Token refreshed');
                                    return AuthActions.refreshTokenSuccess({ accessToken: newToken });
                                }),
                                catchError(refreshError => {
                                    console.log('Init effect - Failed to refresh token',refreshError);
                                    this.authService.removeAccessToken();
                                    return of(AuthActions.logoutSuccess());
                                })
                            );
                        })
                    );
                }
                console.log('Init effect - No token found, completing initialization');
                // return of({ type: '[Auth] Init Complete' });
                return of(AuthActions.initAuthComplete());
            })
        )
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            switchMap(({ credentials, role }) =>
                this.authService.login(credentials,role).pipe(
                    map((response: any) => {
                        this.authService.setAccessToken(response.body.accessToken); // Store in memory
                        if (role === 'admin') {
                            this.router.navigate(['/admin-home']);
                        } else {
                            this.router.navigate(['/user-home']);
                        }
                        return AuthActions.loginSuccess({ accessToken: response.body.accessToken,user:response.body.existingUser });
                    }),
                    catchError((error) => of(AuthActions.loginFailure({ error })))
                )
            )
        )
    );

    signup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signup),
            switchMap(({ credentials }) =>
                this.authService.signup(credentials).pipe(
                    map((response: any) => AuthActions.signupSuccess({ user: response.body })),
                    catchError((error) => of(AuthActions.signupFailure({ error })))
                )
            )
        )
    );

    refreshToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.refreshToken),
            switchMap(({role}) =>
                this.authService.refreshAccessToken().pipe( // removed the role from argument for testing
                    map((response: any) => {
                        this.authService.setAccessToken(response.body.accessToken); // Store in memory
                        return AuthActions.refreshTokenSuccess({ accessToken: response.body.accessToken });
                    }),
                    catchError((error) => of(AuthActions.refreshTokenFailure({ error })))
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            switchMap(({role}) =>
                this.authService.logout(role).pipe(
                    map(() => {
                        this.authService.removeAccessToken(); // Clear from memory
                        this.router.navigate(['/login']);
                        return AuthActions.logoutSuccess();
                    }),
                    catchError((error) => of(AuthActions.logoutFailure({ error })))
                )
            )
        )
    );
}

@Injectable()
export class AdminEffects {
    private actions$=inject(Actions);
    private authService=inject(AuthService);

    fetchUsers$ = createEffect(()=>
        this.actions$.pipe(
            ofType(AdminActions.fetchUsers),
            switchMap(()=>
                this.authService.getUsers().pipe(
                    map(users=> AdminActions.fetchUsersSuccess({users})),
                    catchError(error=>of(AdminActions.fetchUsersFailure({error})))
                )
            )
        )
    )

    updateUser$ = createEffect(()=>
    this.actions$.pipe(
        ofType(AdminActions.updateUser),
        switchMap(({user})=>
            this.authService.updateUser(user).pipe(
                tap(response => {
                    console.log('Response Body:', response.body);
                }),
                map(response=>AdminActions.updateUserSuccess({user:response.body})),
                catchError(error=>of(AdminActions.updateUserFailure({error})))
            )
        )
    ))

    deleteUser$ = createEffect(()=>
    this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        switchMap(({user})=>
        this.authService.deleteUser(user).pipe(
            map(()=>AdminActions.deleteUserSuccess()),
            catchError(error=> of(AdminActions.deleteUserFailure({error})))
        ))
    ))
}