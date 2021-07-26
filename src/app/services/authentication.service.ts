import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const TOKEN_KEY = 'my-token'

export interface Credentials {
  email: string,
  password: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token: string = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    let isAuthenticated: boolean = false;
    if (token && token.value) {
      console.log('Set token: ', token.value);
      this.token = token.value;
      isAuthenticated = true;
    }
    this.isAuthenticated.next(isAuthenticated);
  }

  login(credentials: Credentials): Observable<any> {
    // https://reqres.in/
    return this.http.post('https://reqres.in/api/login', credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({ key: TOKEN_KEY, value: token }));
      }),
      tap(() => this.isAuthenticated.next(true))
    );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}
