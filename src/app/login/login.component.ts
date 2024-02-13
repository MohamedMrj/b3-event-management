import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private router: Router
    
    ) { }

  onLoginClick(): void {
    const loginInfo = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:7071/api/login', loginInfo)
  .subscribe(
    response => {
      // Store token in local storage
      localStorage.setItem('token', response.token);
      // Redirect to desired route (e.g., dashboard)
      this.router.navigate(['/dashboard']);
    },
    error => {
      console.error('Login failed:', error);
      this.loginError = true;
    }
  );
  }
}
