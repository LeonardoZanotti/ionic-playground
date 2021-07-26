import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.authenticationService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuthenticated => {
        console.log('LoginGuard authenticaded: ', isAuthenticated);

        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/login', { replaceUrl: true });
          return false;
        }
      })
    );
  }
}
