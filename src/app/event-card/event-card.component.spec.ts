import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCardComponent } from './event-card.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsUrlPipe } from '../google-maps-url.pipe';
import { LocationFormatPipe } from '../location-format.pipe';
import { CommonModule } from '@angular/common';
import { Event } from '../event';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventCardComponent,
        MatSnackBarModule,
        RouterTestingModule,
        NoopAnimationsModule,
        CommonModule,
        GoogleMapsUrlPipe,
        LocationFormatPipe,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;

    const mockEvent: Event = {
      id: '1',
      title: 'Mock Event',
      longDescription: 'This is a long description for a mock event.',
      shortDescription: 'This is a short description.',
      organizer: 'Mock Organizer',
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      timezone: 'UTC',
      locationStreet: '123 Mock St',
      locationCity: 'Mock City',
      locationCountry: 'Mockland',
      imageUrl: 'https://example.com/mock-image.jpg',
      imageAlt: 'A mock event image'
    };

    component.event = mockEvent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
