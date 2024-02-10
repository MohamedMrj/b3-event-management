import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  // Create a new event
  login(loginInfo: LoginInfo): Observable<LoginInfo> {
    console.log("inside");
    return this.http.post<LoginInfo>('/api/login', loginInfo);
  } 
}

export interface LoginInfo {
    username: string;
    password: string;
}