import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { EventDetailComponent } from './event-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  beforeEach(() => {
    const activatedRouteStub = {
      paramMap: of(new Map([['eventid', '1']])),
      queryParams: of({ eventCreated: 'true', eventUpdated: 'true' })
    };

    TestBed.configureTestingModule({
      imports: [
        EventDetailComponent,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
