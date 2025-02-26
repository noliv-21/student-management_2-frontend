import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthRole } from './state/selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService, private router: Router,private store:Store<{ auth: any }>) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = request;
        const accessToken = this.authService.getAccessToken();

        if (accessToken) {
          authReq = this.addTokenHeader(request, accessToken);
        }

        return next.handle(authReq).pipe(
            catchError(error => {
                if (error.status === 401) {
                    return this.handle401Error(authReq, next);
                }
                return throwError(()=>error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.store.select(selectAuthRole).pipe(
              take(1),
              switchMap((role) => {
                if (!role) {
                  this.isRefreshing = false;
                  this.authService.removeAccessToken();
                  this.router.navigate(['/login']);
                  return EMPTY;
                }
                return this.authService.refreshToken(role).pipe(
                  switchMap((response: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.body.accessToken);
                    this.authService.setAccessToken(response.body.accessToken);
                    return next.handle(this.addTokenHeader(request, response.body.accessToken));
                  }),
                  catchError(() => {
                      this.isRefreshing = false;
                      this.authService.removeAccessToken();
                      this.router.navigate(['/login']);
                      return  EMPTY;
                  })
                );
              })
            );
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(accessToken => {
                return next.handle(this.addTokenHeader(request, accessToken));
            })
        );
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}