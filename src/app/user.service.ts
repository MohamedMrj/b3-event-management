import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserRegistration } from './user';
import { UserAccount } from './auth.interfaces';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) { }

  private handleError<T>(error: any): Observable<ApiResponse<T>> {
    console.error('API error', error);
    return new Observable<ApiResponse<T>>(observer => {
      observer.next({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        data: null as any,
      });
      observer.complete();
    });
  }

  private handleResponse<T>(response: any): ApiResponse<T> {
    // Optionally, transform the response here if needed
    return {
      success: true,
      data: response,
    };
  }

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getUser(userId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`/api/users/${userId}`, { headers: this.getHeaders() })
      .pipe(
        map(this.handleResponse),
        catchError(this.handleError),
      );
  }

  getAllUsers(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>('/api/users', { headers: this.getHeaders() })
      .pipe(
        map(this.handleResponse),
        catchError(this.handleError),
      );
  }

  createUser(user: UserAccount): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/users', user, { headers: this.getHeaders() })
      .pipe(
        map(this.handleResponse),
        catchError(this.handleError),
      );
  }

  updateUser(userId: string, user: UserAccount): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`/api/users/${userId}`, user, { headers: this.getHeaders() })
      .pipe(
        map(this.handleResponse),
        catchError(this.handleError),
      );
  }

  deleteUser(userId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`/api/users/${userId}`, { headers: this.getHeaders() })
      .pipe(
        map(this.handleResponse),
        catchError(this.handleError),
      );
  }

  registerForEvent(
    eventId: string,
    userId: string,
    registrationStatus: string,
  ): Observable<ApiResponse<UserRegistration>> {
    return this.http.put<UserRegistration>(
      `/api/event/${eventId}/registrations/${userId}`,
      { registrationStatus },
      { headers: this.getHeaders() },
    ).pipe(
      map(response => this.handleResponse<UserRegistration>(response)),
      catchError(error => this.handleError<UserRegistration>(error)),
    );
  }

  getUserRegistrations(userId: string): Observable<ApiResponse<UserRegistration[]>> {
    return this.http.get<UserRegistration[]>(`/api/users/${userId}/registrations`, { headers: this.getHeaders() })
      .pipe(
        map(response => ({ success: true, data: response } as ApiResponse<UserRegistration[]>)),
        catchError(error => this.handleError<UserRegistration[]>(error))
      );
  }

  getUserRegistrationForEvent(eventId: string, userId: string): Observable<UserRegistration> {
    return this.http.get<ApiResponse<UserRegistration>>(`/api/users/${userId}/registration/${eventId}`, {
      headers: this.getHeaders(),
    })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            return response.data || 'No user registration for event';
          }
        }),
        catchError(error => {
          console.error('Error fetching user registration for event', error);
          return throwError(() => new Error('Error fetching user registration for event'));
        })
      );
  }
}
