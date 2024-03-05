import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
})
export class InviteDialogComponent {
  emailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InviteDialogComponent>
  ) {
    this.emailsForm = this.fb.group({
      emails: this.fb.array([this.fb.control('')])
    });
  }

  get emailFormArray() {
    return this.emailsForm.get('emails') as FormArray;
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
}
