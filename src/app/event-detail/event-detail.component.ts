import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, AsyncPipe, DatePipe, registerLocaleData } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of, Observable, catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventService } from '../event.service';
import { Event, OrganizerInfo } from '../event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleMapsEmbedUrlPipe } from '../google-maps-embed-url.pipe';
import { SafePipe } from '../safe.pipe';
import { GoogleMapsUrlPipe } from '../google-maps-url.pipe';
import { LocationFormatPipe } from '../location-format.pipe';
import { MarkdownPipe } from 'ngx-markdown';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { UserService } from '../user.service';
import { UserRegistration } from '../user';
import { AuthService } from '../auth.service';
import { UserDetails } from '../auth.interfaces';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../date-format.pipe';
import localeSv from '@angular/common/locales/sv';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatProgressBar,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
    DatePipe,
    MarkdownPipe,
    LocationFormatPipe,
    GoogleMapsUrlPipe,
    SafePipe,
    GoogleMapsEmbedUrlPipe,
    MatRadioModule,
    FormsModule,
    DateFormatPipe,
  ],
})
export class EventDetailComponent implements OnInit {
  event!: Event;
  isLoading: boolean = true;
  eventNotFound: boolean = false;
  organizerInfo$!: Observable<OrganizerInfo | null>;
  registrationStatus!: string;
  currentUser$: Observable<UserDetails | null>;
  statusOptions: string[] = ['Kommer', 'Kanske', 'Kommer inte'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private userService: UserService,
    private authService: AuthService,
    private titleService: Title,
    private snackBar: MatSnackBar,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    registerLocaleData(localeSv);
  }

  ngOnInit() {
    // Check if user is redirected after creating or updating an event
    this.route.queryParams.subscribe((params) => {
      if (params['eventCreated'] === 'true' || params['eventUpdated'] === 'true') {
        if (params['eventCreated'] === 'true') {
          this.snackBar.open('Event skapat.', 'Stäng', {
            duration: 3000,
          });
        }
        if (params['eventUpdated'] === 'true') {
          this.snackBar.open('Event uppdaterat.', 'Stäng', {
            duration: 3000,
          });
        }

        // Specify the types for queryParams
        const queryParams: Record<string, string | undefined> = { ...params };
        delete queryParams['eventCreated'];
        delete queryParams['eventUpdated'];

        // Navigate without the parameters
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: '',
          replaceUrl: true,
        });
      }
    });

    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.fetchEvent(eventId);
        this.currentUser$.subscribe((userDetails) => {
          if (userDetails) {
            this.getUserEventRegistration(eventId, userDetails.userId).subscribe((status) => {
              this.registrationStatus = status.registrationStatus;
            });
          }
        });
      } else {
        this.eventNotFound = true;
      }
    });
  }

  fetchEvent(eventId: string) {
    this.isLoading = true;
    this.eventService
      .fetchEventById(eventId)
      .pipe(
        switchMap((foundEvent) => {
          this.event = foundEvent;
          this.titleService.setTitle(foundEvent.title);
          this.isLoading = false;
          this.eventNotFound = false;
          return this.eventService.getOrganizerContactInfo(foundEvent.creatorUserId);
        }),
        catchError((error) => {
          console.error('Error fetching event:', error);
          this.snackBar.open('Fel vid hämtning av event', 'Stäng', {
            duration: 3000,
          });
          this.isLoading = false;
          this.eventNotFound = true;
          return of(null);
        }),
      )
      .subscribe((info) => {
        this.organizerInfo$ = of(info);
      });
  }

  navigateToEditEvent() {
    if (this.event?.id) {
      this.router.navigate(['/event/update/', this.event.id]);
    }
  }

  deleteEvent() {
    if (this.event?.id) {
      console.log(`Deleting event: ${this.event.id}`);
      this.eventService.deleteEvent(this.event.id).subscribe({
        next: () => {
          console.log(`Event: ${this.event.id} deleted successfully.`);
          this.router.navigate(['/'], {
            queryParams: { eventDeleted: 'true' },
          });
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.snackBar.open('Fel vid radering av event', 'Stäng', {
            duration: 3000,
          });
        },
      });
    }
  }

  getUserEventRegistration(eventId: string, userId: string): Observable<UserRegistration> {
    return this.userService.getUserRegistrationForEvent(eventId, userId);
  }

  rsvp(eventId: string | undefined, userId: string, registrationStatus: string): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('Event kunde inte hittas.', 'Stäng', {
        duration: 3000,
      });
      return;
    }

    this.userService.registerForEvent(eventId, userId, registrationStatus).subscribe({
      next: () => {
        this.snackBar.open('Din anmälan är sparad.', 'Stäng', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Failed to register for event: ', error);
        this.snackBar.open('Misslyckades att spara din anmälan.', 'Stäng', {
          duration: 3000,
        });
      },
    });
  }

  isSameDay(event: Event): boolean {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    return start.toDateString() === end.toDateString();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
