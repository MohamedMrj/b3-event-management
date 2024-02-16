import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginInfo, LoginResponse } from '../login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  onLoginClick(): void {
    const loginInfo: LoginInfo = {
      email: this.email,
      password: this.password
    };

    this.http.post<LoginResponse>('api/login', loginInfo).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['event']);
        } else {
          console.error('Invalid response format:', response);
          this.loginError = true;
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.snackBar.open(error.error, 'Stäng', {
          duration: 5000,
        });
        this.loginError = true;
      }
    });
  }
}
