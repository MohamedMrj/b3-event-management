import { Component, OnInit } from '@angular/core';
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
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginError: boolean = false;
  passwordMinLength: number = 3;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  private checkIfLoggedIn(): void {
    this.authService.validateToken().subscribe({
      next: (response) => {
        if (response.valid) {
          // If the token is valid, redirect to the home page
          this.router.navigate(['/']);
        }
        // If the token is not valid, do nothing and allow the login form to be displayed
      },
      error: () => {
        // Handle error, if needed
      },
    });
  }

  onLoginClick(): void {
    const loginInfo: LoginInfo = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(loginInfo).subscribe({
      next: (success) => {
        if (success) {
          this.loginError = false;
          this.snackBar.open('Inloggning lyckades!', 'Stäng', {
            duration: 3000,
          });
          // Redirect to home page with a full page refresh
          this.router.navigate(['/'], { replaceUrl: true });
        } else {
          this.loginError = true;
          this.snackBar.open('Inloggning misslyckades. Försök igen.', 'Stäng', {
            duration: 5000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 5000,
        });
        this.loginError = true;
      },
    });
  }
}
