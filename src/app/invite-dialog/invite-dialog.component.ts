import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserAccount } from '../auth.interfaces';
import { UserService } from '../user.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
})
export class InviteDialogComponent implements OnInit {
  emailsForm: FormGroup;
  users: UserAccount[] = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InviteDialogComponent>
  ) {
    this.emailsForm = this.fb.group({
      emails: this.fb.array([this.fb.control('')])
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  get emailFormArray() {
    return this.emailsForm.get('emails') as FormArray;
  }

  filterUsers(value: string): UserAccount[] {
    if (!value) {
      return this.users;
    }
    const filterValue = value.toLowerCase();
    return this.users.filter(user =>
      user.username.toLowerCase().includes(filterValue) ||
      user.firstName.toLowerCase().includes(filterValue) ||
      user.lastName.toLowerCase().includes(filterValue)
    );
  }


  // Add this method to your InviteDialogComponent class
  displayFn(user: UserAccount): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  addEmail() {
    this.emailFormArray.push(this.fb.control(''));
  }

  removeEmail(index: number): void {
    this.emailFormArray.removeAt(index);
  }

  sendInvites() {
    this.dialogRef.close(this.emailFormArray.value);
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
        } else {
          console.error('Failed to fetch users:', response.message);
        }
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      },
    });
  }
}
