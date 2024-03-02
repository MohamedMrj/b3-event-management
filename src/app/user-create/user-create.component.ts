import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateUserFormComponent } from '../create-user-form/create-user-form.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  standalone: true,
  imports: [MatButton, MatIcon, CreateUserFormComponent],
})
export class UserCreateComponent {
  constructor(
    private pageLocation: Location,
    private dialog: MatDialog,
  ) { }

  goBack() {
    this.pageLocation.back();
  }

  confirmDiscardChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Lämna sidan',
        message: 'Vill du lämna sidan? Ändringar har inte sparats.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goBack();
      }
    });
  }
}
