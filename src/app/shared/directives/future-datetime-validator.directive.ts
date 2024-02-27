import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator } from '@angular/forms';
import { futureDateTimeValidator } from '../../datetime-validator';

@Directive({
  selector: '[appFutureDateTime]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: FutureDateTimeValidatorDirective,
    multi: true
  }]
})
export class FutureDateTimeValidatorDirective implements Validator {
  validate = futureDateTimeValidator();
}
