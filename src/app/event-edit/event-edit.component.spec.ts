import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEditComponent } from './event-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

const activatedRouteMock = {
  paramMap: of(new Map([['eventid', '1']]))
};

describe('EventEditComponent', () => {
  let component: EventEditComponent;
  let fixture: ComponentFixture<EventEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventEditComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
