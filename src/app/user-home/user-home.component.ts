import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectAuthRole } from '../state/selectors';
import { AuthState } from '../state/model';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { selectCurrentUser } from '../state/selectors';
import { currentUser } from '../state/model';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../state/actions'

@Component({
  selector: 'app-user-home',
  imports: [HeaderComponent,CommonModule,UserProfileComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent implements OnInit {
  user$!: Observable<currentUser | null>;

  constructor(private store:Store<AuthState>, private authService: AuthService){}
  
  ngOnInit():void{
    this.user$=this.store.select(selectCurrentUser);
    const token = this.authService.getAccessToken(); // Implement getToken method in your AuthService
    if (token) {
      // Fetch current user details from backend
      this.authService.fetchCurrentUser().subscribe(user => {
        if (user) {
          this.store.dispatch(AuthActions.setCurrentUser({ user })); // Dispatch action to set current user
        }
      });
    }
  }

}
