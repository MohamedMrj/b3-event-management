import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, formatType: string, omitYearIfCurrent: boolean = false): string {
    if (!value) return '';

    const svLocale = 'sv-SE';
    let formatString = '';
    const currentYear = new Date().getFullYear();
    const valueYear = new Date(value).getFullYear();
    const omitYear = omitYearIfCurrent && currentYear === valueYear;

    switch (formatType) {
      case 'dateFull':
        formatString = omitYear ? 'EEEE d MMMM' : 'EEEE d MMMM yyyy';
        break;
      case 'dateMedium':
        formatString = omitYear ? 'd MMMM' : 'd MMMM yyyy';
        break;
      case 'dateShort':
        formatString = omitYear ? 'MM-dd' : 'yyyy-MM-dd';
        break;
      case 'time':
        formatString = 'HH:mm';
        break;
      case 'dateTime':
        formatString = 'yyyy-MM-dd HH:mm';
        break;
      default:
        formatString = 'yyyy-MM-dd HH:mm';
    }

    return formatDate(value, formatString, svLocale);
  }
}
