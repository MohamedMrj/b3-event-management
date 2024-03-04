import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function futureDateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    return inputDate.getTime() > currentDate.getTime() ? null : { 'invalidDateTime': { value: control.value } };
  };
}
