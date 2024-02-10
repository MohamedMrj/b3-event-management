import { Component } from '@angular/core';
import { LoginInfo, LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(
    private loginService: LoginService
  ) {}

  onLoginClick(): void {
    console.log("insideinfo");
    let l: LoginInfo = {
      username: this.username,
      password: this.password
    }
  
    this.loginService.login(l);
    // Implement your login logic here
    // if (this.username === 'validUsername' && this.password === 'validPassword') {
    //   // Authentication successful
    //   console.log('Login successful');
    //   this.loginError = false;
    //   // Add further logic such as navigating to another page, etc.
    // } else {
    //   // Authentication failed
    //   console.log('Login failed');
    //   this.loginError = true;
    // }
  }

}
