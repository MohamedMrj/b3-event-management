import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should log "Login successful" when valid credentials are provided', () => {
    // Set valid credentials
    component.username = 'validUsername';
    component.password = 'validPassword';

    // Trigger login click
    component.onLoginClick();

    // Assert that the login was successful
    expect(component.loginError).toBeFalsy(); // Assuming loginError is set to false on successful login
  });
});
