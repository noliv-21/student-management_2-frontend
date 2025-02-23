import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { UserCredComponent } from '../components/user-cred/user-cred.component';

@Component({
  selector: 'app-login-signup',
  imports: [HeaderComponent,UserCredComponent],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {
  currentMode: 'login' | 'signup' = 'login';
  onModeChange(mode: 'login' | 'signup'){
    this.currentMode= mode;
  }
}
