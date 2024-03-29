import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from './title.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UserDetails, UserAccount } from './auth.interfaces';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'B3 Eventwebb';
  isValidToken: boolean = false;
  currentUser$: Observable<UserDetails | null>;
  userAccount: UserAccount = {
    id: '',
    userType: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatar: '',
    lastModified: '',
  };

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    private userService: UserService,
  ) {
    this.currentUser$ = this.authService.getCurrentUser();
  }

  ngOnInit() {
    // Validate token and update isValidToken
    this.authService.validateToken().subscribe({
      next: (response) => (this.isValidToken = response.valid),
      error: () => (this.isValidToken = false),
    });

    // Check if user is redirected after deleting an event
    this.route.queryParams.subscribe((params: Record<string, string | undefined>) => {
      if (params['eventDeleted'] === 'true') {
        this.snackBar.open('Event deleted successfully!', 'Close', {
          duration: 3000,
        });

        // Specify the type for queryParams
        const queryParams: Record<string, string | undefined> = { ...params };
        delete queryParams['eventDeleted'];

        // Navigate without the parameter
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: '',
          replaceUrl: true,
        });
      }
    });

    const customTitle = this.titleService.getTitle();
    if (customTitle) {
      this.title = customTitle;
    }

    // Fetch the user account details
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.getUserAccount(user.userId);
      }
    });
  }

  // Get the user account details
  getUserAccount(id: string) {
    this.userService.getUser(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.userAccount = response.data;
        } else {
          console.error('Failed to fetch user account:', response.message);
          this.snackBar.open('Failed to fetch user account.', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Error fetching user account:', error);
        this.snackBar.open('Error fetching user account.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
