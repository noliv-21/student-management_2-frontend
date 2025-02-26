import { Component, Output, EventEmitter,OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthState, currentUser } from '../../state/model';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../state/selectors';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit,OnDestroy {
  title:string='Student Management System';
  showAuthButtons:Boolean=false;
  private routerSubscription: Subscription | undefined;
  currentUser$: Observable<currentUser | null>;

  @Output() modeChange = new EventEmitter<'login' | 'signup'>();
  constructor(private router:Router,private authService:AuthService,private store: Store<AuthState>){
    this.currentUser$ = this.store.select(selectCurrentUser);
  };
  
  switchToLogin(){
    this.modeChange.emit('login');
  }
  switchToSignup(){
    this.modeChange.emit('signup');
  }
  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showAuthButtons = event.url === '/login';
      });
    this.showAuthButtons = this.router.url === '/login';
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  logout(){                                      // We have to use the this.store.dispatch instead of direct service call
    this.currentUser$.subscribe(user => {
      const role = user?.isAdmin ? 'admin' : 'user';
      this.authService.logout(role);
    });
  }
}
