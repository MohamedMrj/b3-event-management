import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginInfo } from '../login';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  passwordMinLength: number = 3;

  onLoginClick(): void {
    const loginInfo: LoginInfo = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginInfo).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.loginError = true;
          this.snackBar.open('Login failed. Please try again.', 'Close', {
            duration: 5000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 5000,
        });
        this.loginError = true;
      }
    });
  }
}
