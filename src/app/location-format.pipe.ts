import { Pipe, PipeTransform } from '@angular/core';
import { Location } from './event';
import { formatLocation } from './utils/location.utils';


@Pipe({
  name: 'locationFormat'
})
export class LocationFormatPipe implements PipeTransform {
  transform(location: string | Location): string {
    return formatLocation(location);
  }
}
