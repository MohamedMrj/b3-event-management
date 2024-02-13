import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiTestComponent } from './api-test.component';

describe('ApiTestComponent', () => {
  let component: ApiTestComponent;
  let fixture: ComponentFixture<ApiTestComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTestComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiTestComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create and fetch event data', () => {
    component.event = {
      id: '',
      title: '',
      longDescription: '',
      shortDescription: '',
      creatorUserId: '',
      locationStreet: '',
      locationCity: '',
      locationCountry: '',
      startDateTime: '',
      endDateTime: '',
      image: '',
      imageAlt: '',
    };

    fixture.detectChanges();

    const mockEvent = {
      id: '3',
      title: 'Test Event',
      longDescription: 'This is a test event',
      shortDescription: 'Test event',
      creatorUserId: 'Test Organizer',
      locationStreet: '123 Test St',
      locationCity: 'Test City',
      locationCountry: 'Test Country',
      startDateTime: '2022-01-01T00:00:00Z',
      endDateTime: '2022-01-02T00:00:00Z',
      image: 'https://example.com/image.jpg',
      imageAlt: 'An example image',
    };

    const req = httpTestingController.expectOne('/api/event/3');
    expect(req.request.method).toEqual('GET');
    req.flush(mockEvent);

    expect(component.event).toEqual(mockEvent);
  });
});
