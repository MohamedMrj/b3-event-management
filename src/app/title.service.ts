import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private title: string = '';

  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  getTitle(): string {
    return this.title;
  }
}
