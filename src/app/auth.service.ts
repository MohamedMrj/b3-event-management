import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginInfo, LoginResponse } from './login';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, UserDetails, TokenValidationResponse } from './auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserDetails | null>;
  public currentUser$: Observable<UserDetails | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserDetails | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.initializeCurrentUser();
  }

  private initializeCurrentUser(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const user: UserDetails = {
          expirationTime: decodedToken.exp,
          userId:
            decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          issuedAt: decodedToken.iat,
          notValidBefore: decodedToken.nbf,
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error initializing user from token', error);
        sessionStorage.removeItem('token');
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }

  login(loginInfo: LoginInfo): Observable<boolean> {
    return this.http.post<LoginResponse>('api/SignIn', loginInfo).pipe(
      map((response) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          const decodedToken = jwtDecode(response.token) as DecodedToken;
          const user = {
            expirationTime: decodedToken['exp'],
            userId:
              decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            issuedAt: decodedToken['iat'],
            notValidBefore: decodedToken['nbf'],
          };
          this.currentUserSubject.next(user);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Login error', error);
        return throwError(() => new Error('Login failed'));
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.currentUserSubject.next(null);
    window.location.href = '/login';
  }

  validateToken(): Observable<TokenValidationResponse> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return of({ valid: false, error: 'Missing token' });
    }

    return this.http.post<TokenValidationResponse>('api/validateToken', { token: token }).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Token validation error', error);
        return of({ valid: false, error: 'Token validation failed' });
      }),
    );
  }

  decodeToken(): Observable<DecodedToken | null> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return of(null);
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return of(decoded);
    } catch (error) {
      console.error('Error decoding token', error);
      return throwError(() => new Error('Error decoding token'));
    }
  }

  getCurrentUser(): Observable<UserDetails | null> {
    return this.currentUser$;
  }
}
