import { Component } from '@angular/core';
import { LoginInfo, LoginService } from '../login.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private http: HttpClient) { }

  onLoginClick(): void {
    const loginInfo = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:7071/api/login', loginInfo)
      .subscribe(
        response => {
          // Handle successful login
          console.log('Login successful');
          this.loginError = false;
          // Add further logic such as navigating to another page, etc.
        },
        error => {
          // Handle login error
          console.error('Login failed:', error);
          this.loginError = true;
        }
      );
  }
}
