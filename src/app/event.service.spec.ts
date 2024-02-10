import { TestBed } from '@angular/core/testing';
import { Event } from './event';
import { EventService } from './event.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchAllEvents should make a GET request to fetch all events', () => {
    const mockEvents: Event[] = [];

    service.fetchAllEvents().subscribe((events) => {
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne('/api/getAllEvents');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });
});
