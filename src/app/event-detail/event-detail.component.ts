import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, AsyncPipe, DatePipe, registerLocaleData } from '@angular/common';
import { switchMap, } from 'rxjs/operators';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClient } from '@angular/common/http';
import { getGoogleMapsEmbedUrl } from '../utils/location.utils';

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
    MatTooltipModule,
    MatExpansionModule,
  ],
})
export class EventDetailComponent implements OnInit {
  event!: Event;
  isLoading: boolean = true;
  eventNotFound: boolean = false;
  organizerInfo$!: Observable<OrganizerInfo | null>;
  registrationStatus: string | null = 'RSVP';
  currentUser$: Observable<UserDetails | null>;
  statusOptions: string[] = ['Kommer', 'Kanske', 'Kommer inte'];
  eventRegistrations: UserRegistration[] = [];
  comingRegistrations: UserRegistration[] = [];
  maybeRegistrations: UserRegistration[] = [];
  notComingRegistrations: UserRegistration[] = [];
  panelOpenState = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private userService: UserService,
    private authService: AuthService,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
    registerLocaleData(localeSv);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('eventid');
      if (eventId) {
        this.fetchEventAndRegistrations(eventId);
      } else {
        this.eventNotFound = true;
      }
    });
  }

  fetchEventAndRegistrations(eventId: string): void {
    this.isLoading = true;

    this.eventService.fetchEventById(eventId).pipe(
      switchMap(event => {
        this.event = event;
        this.titleService.setTitle(event.title);
        return this.eventService.fetchAllResponses(eventId);
      }),
      catchError(error => {
        console.error('Error fetching event:', error);
        this.snackBar.open('Fel vid hämtning av event', 'Stäng', { duration: 3000 });
        this.isLoading = false;
        this.eventNotFound = true;
        return of([]);
      })
    ).subscribe(registrations => {
      this.eventRegistrations = registrations;
      this.filterRegistrationsByStatus(registrations);
      this.setRegistrationStatusForCurrentUser();
      this.isLoading = false;
    });
  }


  private filterRegistrationsByStatus(registrations: UserRegistration[]): void {
    this.comingRegistrations = registrations.filter(r => r.registrationStatus === 'Kommer');
    this.maybeRegistrations = registrations.filter(r => r.registrationStatus === 'Kanske');
    this.notComingRegistrations = registrations.filter(r => r.registrationStatus === 'Kommer inte');
  }

  setRegistrationStatusForCurrentUser(): void {
    this.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        const userRegistration = this.eventRegistrations.find(r => r.userId === currentUser.userId);
        this.registrationStatus = userRegistration ? userRegistration.registrationStatus : null;
      }
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

  copyToClipboard(eventId: string | undefined): void {
    if (!eventId) {
      console.error('Event ID is undefined');
      this.snackBar.open('Event ID saknas.', 'Stäng', { duration: 3000 });
      return;
    }

    const url = window.location.origin + '/event/' + eventId;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        this.snackBar.open('Kopierad till urklipp.', 'Stäng', {
          duration: 3000,
        }),
      )
      .catch((error) => console.error('Failed to copy to clipboard: ', error));
  }

  isSameDay(event: Event): boolean {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    return start.toDateString() === end.toDateString();
  }

  goBack() {
    this.router.navigate(['/']);
  }
  
  // Nedan är kod för att skapa ICS i frontend.

  generateAndDownloadICS() {
    

    const title = this.event.title;
    let description = this.event.shortDescription + "\\n\\n" + this.event.longDescription; 
    description = this.formatIcsText(description); // 
  
    const startDateTime = this.formatDateForIcs(new Date(this.event.startDateTime));
    const endDateTime = this.formatDateForIcs(new Date(this.event.endDateTime));

    const location = [
      this.event.locationStreet,
      this.event.locationCity,
      this.event.locationCountry
    ].filter(part => part).join(', ');
  

  
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Your Organization//EN",
      "BEGIN:VEVENT",
      `DTSTAMP:${this.formatDateForIcs(new Date())}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  formatDateForIcs(date: Date): string {
    return [
      date.getUTCFullYear(),
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      date.getUTCDate().toString().padStart(2, '0'),
      'T',
      date.getUTCHours().toString().padStart(2, '0'),
      date.getUTCMinutes().toString().padStart(2, '0'),
      date.getUTCSeconds().toString().padStart(2, '0'),
      'Z'  
    ].join('');
  }

  formatIcsText(text: string): string {
    let result = '';
    text = text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
    while (text.length > 0) {
      let line = text.substring(0, 75);
      text = text.substring(75);
      result += (result ? '\r\n ' : '') + line;
    }
    return result;
  }
}
