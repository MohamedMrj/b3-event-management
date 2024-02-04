import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  event: Event | undefined;
  eventNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private eventService: EventService,
    private pageLocation: Location,
    private dialog: MatDialog,
  ) {}

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
        // Add more error handling such as showing an error message to the user
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
          console.log(`Deleting event: ${this.event.id}`);
          this.eventService.deleteEvent(this.event.id).subscribe({
            next: (response) => {
              console.log(`Event: ${this.event.id} deleted successfully.`);
              this.router.navigate(['/']);
            },
            error: (error) => {
              console.error('Error deleting event:', error);
              // Add more error handling such as showing an error message to the user
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
