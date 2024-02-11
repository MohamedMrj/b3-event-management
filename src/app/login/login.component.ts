import { Component } from '@angular/core';
import { LoginInfo, LoginService } from '../login.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule]
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
