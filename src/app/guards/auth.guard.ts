import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map,switchMap,take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { selectIsLoggedIn,selectIsAdmin } from '../state/selectors';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const authService = inject(AuthService);
  // if(authService.isLoggedIn()){
  //   return true;
  // }
  // return router.createUrlTree(['/login']);
  const store = inject(Store);
  return store.select(selectIsLoggedIn).pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};

export const AdminGuard: CanActivateFn = (route, state)=>{
  const router = inject(Router);
  // const authService = inject(AuthService);
  // if (authService.isLoggedIn() && authService.isAdmin()) {
  //   return true;
  // }
  // return authService.isLoggedIn() 
  //   ? router.createUrlTree(['/user-home'])
  //   : router.createUrlTree(['/login']);
  const store = inject(Store);
  return store.select(selectIsAdmin).pipe(
    take(1),
    map(isAdmin => {
      // If user is admin, allow access
      if (isAdmin) {
        return true;
      }
      
      // If not admin, redirect to user home page
      return router.createUrlTree(['/user-home']);
    })
  );
}

export const LoginPageGuard: CanActivateFn = (route,state)=>{
  const router=inject(Router);
  const store = inject(Store);
  console.log('LoginPageGuard activated, navigation from:', state.url);

  return store.select(selectIsLoggedIn).pipe(
    take(1),
    switchMap(isLoggedIn => {
      // If not logged in, allow access to login page
      console.log('Is user logged in?', isLoggedIn);
      if (!isLoggedIn) {
        console.log('User is not logged in, allowing access to login page');
        return of(true);
      }
      
      // If logged in, check if admin
      return store.select(selectIsAdmin).pipe(
        take(1),
        map(isAdmin => {
          console.log('Is user admin?', isAdmin);
          // Redirect based on user role
          if (isAdmin) {
            console.log('User is admin, redirecting to admin-home');
            // Force navigation instead of returning UrlTree
            router.navigateByUrl('/admin-home', { replaceUrl: true });
            return false;
            // return router.createUrlTree(['/admin-home']);
          } else {
            console.log('User is not admin, redirecting to user-home');
            // Force navigation instead of returning UrlTree
            router.navigateByUrl('/user-home', { replaceUrl: true });
            return false;
            // return router.createUrlTree(['/user-home']);
          }
        })
      );
    })
  );
}
