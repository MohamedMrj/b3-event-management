import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.validateToken().pipe(
      map((response) => {
        if (response.valid) {
          return true;
        } else {
          this.authService.setRedirectUrl(state.url);
          return this.router.createUrlTree(['/login']);
        }
      }),
      catchError((err) => {
        console.error('Unexpected error during token validation', err);
        this.authService.setRedirectUrl(state.url);
        return of(this.router.createUrlTree(['/login']));
      }),
    );
  }
}
