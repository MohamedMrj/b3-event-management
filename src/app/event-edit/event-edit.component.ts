import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEventFormComponent } from '../create-event-form/create-event-form.component';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.component.html',
    styleUrls: ['./event-edit.component.css'],
    standalone: true,
    imports: [
        MatButton,
        MatIcon,
        MatIconButton,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        CreateEventFormComponent,
    ],
})
export class EventEditComponent implements OnInit {
  event: Event;
  eventNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private eventService: EventService,
    private pageLocation: Location,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.fetchEvent(eventId);
      }
    });
  }

  fetchEvent(eventId: string) {
    this.eventService.fetchEventById(eventId).subscribe({
      next: (foundEvent) => {
        this.event = foundEvent;
        this.titleService.setTitle(`Editing ${foundEvent.title}`);
        this.eventNotFound = false;
      },
      error: () => {
        this.eventNotFound = true;
        this.titleService.setTitle('Event Not Found');
        this.snackBar.open('Event not found', 'Close', { duration: 3000 });
      },
    });
  }

  deleteEvent() {
    if (this.event?.id) {
      // Confirm deletion with the user
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Are you sure you want to delete this event?' },
      });

      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.eventService.deleteEvent(this.event.id).subscribe({
            next: () => {
              console.log(`Event: ${this.event.id} deleted successfully.`);
              this.router.navigate(['/'], { queryParams: { eventDeleted: 'true' } });
            },
            error: (error) => {
              console.error('Error deleting event:', error);
              this.snackBar.open('Error deleting event', 'Close', {
                duration: 3000,
              });
            },
          });
        }
      });
    }
  }

  goBack() {
    this.pageLocation.back();
  }

  confirmDiscardChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Do you want to discard the changes?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goBack();
      }
    });
  }
}
