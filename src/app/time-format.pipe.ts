import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(time: { hour: number, minute: number }): string {
    if (!time) {
      return '';
    }
    let hour = time.hour.toString().padStart(2, '0');
    let minute = time.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
}
