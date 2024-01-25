import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'B3 Events';
  message = '';

  constructor(private http: HttpClient, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title); //

    this.get().subscribe(response => {
      this.message = response;
    });
  }

  private get(): Observable<any> {
    let params = new HttpParams().set('name', 'B3-eventwebb');

    return this.http.get('/api/message', { responseType: 'text', params: params });
  }

  eventSubtitle = 'Dog Lovers Meetup';
  eventTitle = 'Shiba Inu Gathering';
  eventLongText = 'Join us for a fun afternoon with Shiba Inus!';
  eventImageUrl = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
  eventImageAlt = 'Photo of a Shiba Inu';
}
