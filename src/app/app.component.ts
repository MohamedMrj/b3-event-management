import { Component, OnInit } from '@angular/core';
import { TitleService } from './title.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'B3 Eventwebb'; // Fallback title

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Check if user is redirected after deleting an event
    this.route.queryParams.subscribe((params) => {
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
}
