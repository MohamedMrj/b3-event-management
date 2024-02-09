import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreateEventFormComponent } from './create-event-form.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreateEventFormComponent', () => {
  let component: CreateEventFormComponent;
  let fixture: ComponentFixture<CreateEventFormComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      paramMap: of(new Map([['eventid', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateEventFormComponent,
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
