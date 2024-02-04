import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestComponent } from './api-test.component';

describe('ApiTestComponent', () => {
  let component: ApiTestComponent;
  let fixture: ComponentFixture<ApiTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApiTestComponent],
    });
    fixture = TestBed.createComponent(ApiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
