import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class PageNotFoundComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Page Not Found');
  }
}
