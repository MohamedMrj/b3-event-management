import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateEventFormComponent } from '../create-event-form/create-event-form.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
  standalone: true,
  imports: [MatButton, MatIcon, CreateEventFormComponent],
})
export class EventCreateComponent {
  constructor(
    private pageLocation: Location,
    private dialog: MatDialog,
  ) {}

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
