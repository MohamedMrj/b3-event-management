import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule],
})
export class EventCardComponent {
  longText = `The sun sets over the horizon, painting the sky in hues of orange and pink. Birds chirp and flowers bloom, signaling the arrival of spring.`;
}
