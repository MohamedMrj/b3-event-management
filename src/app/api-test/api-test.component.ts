import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.css']
})
export class ApiTestComponent {
  message = '';

  constructor(private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("API Test");
  }

  ngOnInit() {
    this.get().subscribe(response => {
      this.message = response;
    }, error => {
      console.error('Error fetching data:', error);
      this.message = 'Error fetching data';
    });
  }

  private get(): Observable<any> {
    let params = new HttpParams().set('name', 'B3-eventwebb');
    return this.http.get('/api/message', { responseType: 'text', params: params });
  }
}
