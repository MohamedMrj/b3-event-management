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
  title = 'Events';
  message = '';

  constructor(private http: HttpClient, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);

    this.get().subscribe(response => {
      this.message = response;
    });
  }

  private get(): Observable<any> {
    let params = new HttpParams().set('name', 'B3-eventwebb');

    return this.http.get('/api/message', { responseType: 'text', params: params });
  }
}
