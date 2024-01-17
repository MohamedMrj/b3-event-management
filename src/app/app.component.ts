import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `<div>{{message}}</div>`,
})
export class AppComponent implements OnInit {
  message = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.get().subscribe(response => {
      this.message = response;
    });
  }

  private get(): Observable<any> {
    let params = new HttpParams().set('name', 'B3-eventwebb');

    return this.http.get('/api/message', { responseType: 'text', params: params });
  }
}