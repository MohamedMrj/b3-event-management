import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class UnauthorizedComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Unauthorized');
  }
}
