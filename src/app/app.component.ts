import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './state/actions';
import { selectIsLoggedIn, selectIsAdmin } from './state/selectors';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'student-management-app';

  constructor(private store: Store,private router:Router) {}
  
  ngOnInit() {
    // Dispatch the initialization action
    this.store.dispatch(AuthActions.initAuth());
    console.log('Auth initialization dispatched');
    this.store.select(selectIsLoggedIn).pipe(
      filter(isLoggedIn => isLoggedIn === true),
      take(1)
    ).subscribe(isLoggedIn => {
      if (this.router.url === '/login') {
        this.store.select(selectIsAdmin).pipe(take(1)).subscribe(isAdmin => {
          if (isAdmin) {
            this.router.navigateByUrl('/admin-home', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/user-home', { replaceUrl: true });
          }
        });
      }
    });
  }
}
