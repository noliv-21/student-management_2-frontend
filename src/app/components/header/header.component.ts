import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title:string='Student Management System';
  @Output() modeChange = new EventEmitter<'login' | 'signup'>();
  
  switchToLogin(){
    this.modeChange.emit('login');
  }
  switchToSignup(){
    this.modeChange.emit('signup');
  }
}
