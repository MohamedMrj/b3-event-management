import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event } from '../event';
import { UserDetails } from '../auth.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { AuthService } from '../auth.service';
import { FutureDateTimeValidatorDirective } from '../shared/directives/future-datetime-validator.directive';
import { ValidateEndDateDirective } from '../shared/directives/validate-end-date.directive';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatHint,
    MatSelect,
    NgFor,
    MatOption,
    MatButton,
    FutureDateTimeValidatorDirective,
    ValidateEndDateDirective,
  ],
})
export class CreateEventFormComponent implements OnInit {
  submitted = false;
  isEditMode = false;
  eventId: string = '';
  currentUser$: Observable<UserDetails | null>;

  event: Event = {
    id: '',
    title: '',
    longDescription: '',
    shortDescription: '',
    locationStreet: '',
    locationCity: '',
    locationCountry: 'Sverige',
    creatorUserId: '',
    startDateTime: '',
    endDateTime: '',
    image: '',
    imageAlt: '',
  };

  // Set maxlength for input fields
  titleMaxLength: number = 30;
  shortDescriptionMaxLength: number = 100;
  locationStreetMaxLength: number = 30;
  locationCityMaxLength: number = 50;
  locationCountryMaxLength: number = 50;
  imageAltMaxLength: number = 100;
  longDescriptionMaxLength: number = 10000;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    private userService: UserService,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
  }

  @ViewChild('createEventForm') createEventForm!: NgForm;

  // Getter to check if the form is dirty
  get isFormDirty(): boolean {
    return this.createEventForm?.dirty ?? false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.isEditMode = true;
        this.fetchEvent(eventId);
      }
    });
  }

  fetchEvent(eventId: string) {
    this.eventService.fetchEventById(eventId).subscribe({
      next: (foundEvent) => {
        this.event = foundEvent;
        if (this.event.startDateTime) {
          const startDateTime = new Date(this.event.startDateTime);
          const timeZoneOffset = startDateTime.getTimezoneOffset() * 60000; // Offset in milliseconds
          const localStartDate = new Date(startDateTime.getTime() - timeZoneOffset);
          this.event.startDateTime = localStartDate.toISOString().slice(0, 16); // Converts to 'YYYY-MM-DDTHH:mm' format
        }

        if (this.event.endDateTime) {
          const endDateTime = new Date(this.event.endDateTime);
          const timeZoneOffset = endDateTime.getTimezoneOffset() * 60000; // Offset in milliseconds
          const localEndDate = new Date(endDateTime.getTime() - timeZoneOffset);
          this.event.endDateTime = localEndDate.toISOString().slice(0, 16); // Converts to 'YYYY-MM-DDTHH:mm' format
        }
      },
      error: () => {
        console.error('Event not found:', eventId);
        this.snackBar.open('Event not found', 'Close', { duration: 3000 });
      },
    });
  }

  isImageAltRequired(): boolean {
    return this.event.image !== null && this.event.image.trim() !== '';
  }

  onSubmit() {
    this.submitted = true;

    // Convert startDateTime and endDateTime to ISO format
    if (this.event.startDateTime) {
      this.event.startDateTime = new Date(this.event.startDateTime).toISOString();
    }
    if (this.event.endDateTime) {
      this.event.endDateTime = new Date(this.event.endDateTime).toISOString();
    }

    // Handle event creation
    if (!this.isEditMode) {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          this.event.creatorUserId = currentUser.userId;

          this.eventService.createEvent(this.event).subscribe({
            next: (createdEvent) => {
              console.log('Event created successfully:', createdEvent);

              this.userService.registerForEvent(createdEvent.id!, currentUser.userId, "Kommer").subscribe({
                next: () => {
                  console.log('User successfully registered for the event');

                  this.router.navigate(['/event', createdEvent.id], {
                    queryParams: { eventCreated: 'true' },
                  });
                },
                error: (error) => {
                  console.error('Error registering user for the event:', error);
                  this.snackBar.open('Misslyckades att registrera användare för event.', 'Stäng', {
                    duration: 3000,
                  });
                },
              });
            },
            error: (error) => {
              console.error('Error creating event:', error);
              this.snackBar.open('Error creating event', 'Close', {
                duration: 3000,
              });
              this.submitted = false;
            },
          });
        }
      });
    }
    // Handle event update
    else if (this.isEditMode && this.event.id) {
      this.eventService.updateEvent(this.event.id, this.event).subscribe({
        next: (updatedEvent) => {
          console.log('Event updated successfully:', updatedEvent);
          this.router.navigate(['/event', updatedEvent.id], {
            queryParams: { eventUpdated: 'true' },
          });
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.snackBar.open('Error updating event', 'Close', {
            duration: 3000,
          });
          this.submitted = false;
        },
      });
    }
  }
}
