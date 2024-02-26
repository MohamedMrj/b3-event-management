import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, formatType: string): string {
    if (!value) return '';

    const svLocale = 'sv-SE';
    let formatString = '';

    switch (formatType) {
      case 'dateFull':
        formatString = 'EEEE d MMMM yyyy';
        break;
      case 'dateMedium':
        formatString = 'd MMMM yyyy';
        break;
      case 'dateShort':
        formatString = 'yyyy-MM-dd';
        break;
      case 'time':
        formatString = 'HH:mm';
        break;
      default:
        formatString = 'yyyy-MM-dd HH:mm';
    }

    return formatDate(value, formatString, svLocale);
  }

}
