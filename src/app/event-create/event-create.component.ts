import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  constructor(
    private titleService: Title,
    private pageLocation: Location,
    private dialog: MatDialog,
    ) {
    this.titleService.setTitle('Create Event');
  }

  goBack() {
    this.pageLocation.back();
  }

  confirmDiscardChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Do you want to discard the changes?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.goBack();
      }
    });
  }
}
