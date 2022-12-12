import {AbstractControl, FormArray} from '@angular/forms';

export const markFormGroupDirty = (formGroup) => {
  formGroup.markAsDirty();
  Object.values<AbstractControl>(formGroup.controls).forEach(control => {
    control.markAsDirty();
    control.updateValueAndValidity();
    if (control instanceof FormArray && control.controls) {
      markFormGroupDirty(control);
    }
  });
  formGroup.updateValueAndValidity();
};

export const disableFormGroup = (formGroup) => {
  formGroup.disable();
  Object.values<AbstractControl>(formGroup.controls).forEach(control => {
    formGroup.disable();
    if (control instanceof FormArray && control.controls) {
      disableFormGroup(control);
    }
  });
};

export const compareRemindPush = (a, b) => {
  if (a && b && a.pushedAt && b.pushedAt) {
    (a.pushedAt as Date).setHours(0, 0, 0, 0);
    (b.pushedAt as Date).setHours(0, 0, 0, 0);
  }
  return a && b && ((a.periodId && a.periodId === b.periodId) || (a.pushedAt && a.pushedAt === b.pushedAt));
};

export const FILE_TYPE = 'image/png,image/jpeg';
