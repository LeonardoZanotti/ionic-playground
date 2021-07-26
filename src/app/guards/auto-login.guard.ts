import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.authenticationService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuthenticated => {
        console.log('AutoLoginGuard authenticaded: ', isAuthenticated);

        if (isAuthenticated) {
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        } else {
          return true;
        }
      })
    );
  }
}
