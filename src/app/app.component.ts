


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
import { NgIf } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterOutlet, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'B3 Eventwebb'; // Fallback title
  userEmail: string = '';
  isValidToken: boolean = false; // Add this line

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('userEmail') || 'Not Logged In';

    // Validate token and update isValidToken
    this.authService.validateToken().subscribe({
      next: (response) => this.isValidToken = response.valid,
      error: () => this.isValidToken = false
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
          queryParamsHandling: '', // remove to keep other query params
          replaceUrl: true, // does not add this navigation to history
        });
      }
    });

    const customTitle = this.titleService.getTitle();
    if (customTitle) {
      this.title = customTitle;
    }
  }

  isLoginPage() {
    return this.router.url === '/login';
  }

  getUsernameFromEmail(): string {
    return this.userEmail.split('@')[0];
  }
}
