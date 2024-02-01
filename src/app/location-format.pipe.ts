import { Pipe, PipeTransform } from '@angular/core';
import { EventLocation } from './event';
import { formatLocation } from './utils/location.utils';


@Pipe({
  name: 'locationFormat'
})
export class LocationFormatPipe implements PipeTransform {
  transform(location: string | EventLocation): string {
    return formatLocation(location);
  }
}
