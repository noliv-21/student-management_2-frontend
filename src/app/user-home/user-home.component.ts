import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription, filter, take, tap } from 'rxjs';
// import { filter } from 'rxjs/operators';
import { selectAuthRole } from '../state/selectors';
import { AuthState } from '../state/model';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { selectCurrentUser } from '../state/selectors';
import { currentUser } from '../state/model';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../state/actions'
import { selectAuthState } from '../state/selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  imports: [HeaderComponent, CommonModule, UserProfileComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent implements OnInit {
  user$!: Observable<currentUser>;

  constructor(private store: Store<AuthState>, private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.store.select(selectAuthState).subscribe(state => console.log('Store state:', state));

    // Check if user is already in store
    this.store.select(selectCurrentUser).pipe(
      take(1)
    ).subscribe(user => {
      if (!user) {
        // User not in store, try to fetch from backend
        const accessToken = this.authService.getAccessToken();
        if (accessToken) {
          // We have a token, try to fetch user data
          this.authService.fetchCurrentUser().subscribe({
            next: (user) => {
              if (user) { // Add a type guard
                this.store.dispatch(AuthActions.loginSuccess({ accessToken,user }));
              } else {
                console.error('User data is null');
                // Handle the null case
              }          
            },
            error: (err) => {
              console.error('Failed to fetch user data:', err);
              // Token might be invalid, try to refresh
              this.refreshToken();
            }
          });
        } else {
          // No token, try to refresh
          this.refreshToken();
        }
      }
    });

    this.user$ = this.store.select(selectCurrentUser).pipe(
      filter(user => user !== null),
      tap(user => console.log('User data from store:', user))
    ) as Observable<currentUser>;

    console.log('user-home data on OnInit', this.user$);

    // const accessToken = this.authService.getAccessToken();
    // if (!accessToken) {
    //   // Fetch current user details from backend
    //   this.authService.refreshAccessToken().subscribe({
    //     next: (newToken) => {
    //       this.authService.setAccessToken(newToken);
    //     },
    //     error: (err) => {
    //       console.error('Failed to refresh accessToken', err)
    //       // Redirect to login or handle error
    //       this.user$.pipe(
    //         take(1),
    //       ).subscribe(user => {
    //         const role = user?.isAdmin ? 'admin' : 'user';
    //         this.store.dispatch(AuthActions.logout({ role }));
    //       });
    //     }
    //   });
      // this.authService.fetchCurrentUser().subscribe(user => {
      //   if (user) {
      //     this.store.dispatch(AuthActions.setCurrentUser({ user })); // Dispatch action to set current user
      //   }
      // });
    // }
  }
  private refreshToken(): void {
    this.authService.refreshAccessToken().subscribe({
      next: (newToken) => {
        this.authService.setAccessToken(newToken);
        // After refreshing token, fetch user data
        this.authService.fetchCurrentUser().subscribe({
          next: (user) => {
            if (user) { // Add a type guard
              this.store.dispatch(AuthActions.loginSuccess({accessToken:newToken, user }));
            } else {
              console.error('User data is null after token refresh');
              // Handle the null case
            }
          },
          error: (err) => {
            console.error('Failed to fetch user data after token refresh:', err);
            // Redirect to login
            // this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        console.error('Failed to refresh accessToken', err);
        // Redirect to login
        this.router.navigate(['/login']);
      }
    });
  }

}
