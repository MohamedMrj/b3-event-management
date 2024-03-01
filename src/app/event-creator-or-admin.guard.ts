import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { UserDetails } from './auth.interfaces';

@Injectable({ providedIn: 'root' })
export class EventCreatorOrAdminGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const eventId = route.params['eventid'];

    return this.authService.getCurrentUser().pipe(
      switchMap((userDetails: UserDetails | null) => {
        if (!userDetails) {
          return [this.router.createUrlTree(['/login'])];
        }

        return this.eventService.fetchEventById(eventId).pipe(
          map(event => {
            if (userDetails.userId === event.creatorUserId || userDetails.role.toLowerCase() === 'admin') {
              return true;
            } else {
              return this.router.createUrlTree(['/unauthorized']);
            }
          })
        );
      })
    );
  }
}
