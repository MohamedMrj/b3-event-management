import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEditComponent } from './event-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventService } from '../event.service';
import { of } from 'rxjs';

const activatedRouteMock = {
  paramMap: of(new Map([['eventid', '1']])),
};

const eventServiceMock = {
  fetchEventById: () =>
    of({
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
      imageAlt: 'A mock event image',
    }),
};

describe('EventEditComponent', () => {
  let component: EventEditComponent;
  let fixture: ComponentFixture<EventEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventEditComponent, // Import the standalone component here
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: EventService, useValue: eventServiceMock }, // Provide the mock EventService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit and other lifecycle events
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Optionally, add more checks here
  });
});
