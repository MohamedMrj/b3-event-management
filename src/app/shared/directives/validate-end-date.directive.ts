import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateEndDate]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidateEndDateDirective, multi: true }]
})
export class ValidateEndDateDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    const startDateControl = control.root.get('startDateTime');
    if (!startDateControl || !control.value) {
      return null;
    }
    const startDate = new Date(startDateControl.value);
    const endDate = new Date(control.value);
    return endDate >= startDate ? null : { 'endDateInvalid': true };
  }
}
