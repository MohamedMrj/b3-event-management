import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event } from '../event';
import { NgIf, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEventFormComponent } from '../event-form/event-form.component';
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
    NgIf,
  ],
})
export class EventEditComponent implements OnInit {
  event!: Event;
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

  @ViewChild(CreateEventFormComponent) createEventFormComponent!: CreateEventFormComponent;

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
        this.titleService.setTitle(`Redigerar: ${foundEvent.title}`);
        this.eventNotFound = false;
      },
      error: () => {
        this.eventNotFound = true;
        this.titleService.setTitle('Event hittades ej');
        this.snackBar.open('Event hittades ej', 'Stäng', { duration: 3000 });
      },
    });
  }

  deleteEvent() {
    if (this.event?.id) {
      // Confirm deletion with the user
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { title: 'Radera event', message: 'Vill du radera eventet?' },
      });

      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result && this.event?.id) {
          this.eventService.deleteEvent(this.event.id).subscribe({
            next: () => {
              console.log(`Event: ${this.event.id} deleted.`);
              this.router.navigate(['/'], {
                queryParams: { eventDeleted: 'true' },
              });
            },
            error: (error) => {
              console.error('Error deleting event:', error);
              this.snackBar.open('Fel vid borttag av event', 'Stäng', {
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
    if (this.createEventFormComponent.isFormDirty) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Lämna sidan',
          message: 'Vill du lämna sidan? Ändringar har inte sparats.',
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.goBack();
        }
      });
    } else {
      this.goBack();
    }
  }
}
