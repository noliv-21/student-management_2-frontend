import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { UserCredComponent } from '../components/user-cred/user-cred.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAccessToken,
  selectAuthError,
  selectAuthLoading,
  selectIsLoggedIn,
  selectCurrentUser,
} from '../state/selectors';
import { currentUser } from '../state/model';

@Component({
  selector: 'app-login-signup',
  imports: [HeaderComponent,UserCredComponent],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent implements OnInit{
  accessToken$: Observable<string | null>;
  user$: Observable<currentUser | null>;
  error$: Observable<any>;
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  constructor(private store: Store) {
    this.accessToken$ = this.store.select(selectAccessToken);
    this.user$ = this.store.select(selectCurrentUser);
    this.error$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }
  ngOnInit(): void {}

  currentMode: 'login' | 'signup' = 'login';
  onModeChange(mode: 'login' | 'signup'){
    this.currentMode= mode;
  }
}
