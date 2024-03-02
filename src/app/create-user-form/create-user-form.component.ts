import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UserAccount } from '../auth.interfaces';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';

interface ApiResponse<T> {
  data: T;
  // potentially other fields like 'message', 'status', etc.
}

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatHint,
    MatSelect,
    MatOption,
    MatButton,
  ],
})
export class CreateUserFormComponent implements OnInit {
  submitted = false;
  isEditMode = false;
  userId: string = '';

  user: UserAccount = {
    id: '',
    userType: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatar: '',
    lastModified: '',
  };

  // User types
  userTypes = ['Admin', 'User'];

  // Password constraints
  passwordMaxLength = 128;
  passwordMinLength = 10;

  avatarMaxLength = 1000;

  @ViewChild('createUserForm') createUserForm!: NgForm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userid');
      if (userId) {
        this.isEditMode = true;
        this.userService.getUser(userId).subscribe({
          next: (response) => {
            this.user = response.data as UserAccount;
          },
          error: () => this.snackBar.open('User not found', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  fetchUser(userId: string) {
    this.userService.getUser(userId).subscribe({
      next: (response) => {
        this.user = response.data as UserAccount;
      },
      error: () => {
        console.error('User not found:', userId);
        this.snackBar.open('User not found', 'Close', { duration: 3000 });
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    const operation$ = this.isEditMode ?
      this.userService.updateUser(this.user.id, this.user) :
      this.userService.createUser(this.user);

    operation$.subscribe({
      next: (response) => {
        const updatedOrCreatedUser = response.data;
        this.snackBar.open(`User ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Close', { duration: 3000 });
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} user:`, error);
        this.snackBar.open(`Error ${this.isEditMode ? 'updating' : 'creating'} user`, 'Close', { duration: 3000 });
        this.submitted = false;
      },
    });
  }
}
