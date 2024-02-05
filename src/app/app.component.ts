import { Component, OnInit } from '@angular/core';
import { TitleService } from './title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'B3 Eventwebb'; // Fallback title

  constructor(private titleService: TitleService) {}

  ngOnInit() {
    const customTitle = this.titleService.getTitle();
    if (customTitle) {
      this.title = customTitle;
    }
  }
}
