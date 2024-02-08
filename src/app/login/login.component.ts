import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor() {}

  onLoginClick(): void {
    // Implement your login logic here
    if (this.username === 'validUsername' && this.password === 'validPassword') {
      // Authentication successful
      console.log('Login successful');
      this.loginError = false;
      // Add further logic such as navigating to another page, etc.
    } else {
      // Authentication failed
      console.log('Login failed');
      this.loginError = true;
    }
  }

}
