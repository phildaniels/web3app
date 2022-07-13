import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stringIsValidInput(value: string | null | undefined): boolean {
  return value != null && value.trim().length > 0;
}

export function notOnlyWhiteSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const onlyWhiteSpace = control.value?.trim() === '';
    return onlyWhiteSpace ? { onlyWhiteSpace: { value: control.value } } : null;
  };
}
