import { AbstractControl, ValidatorFn } from '@angular/forms';

export function htmlValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {'html-validator': {value: control.value}} : null;
    };
}

export function password(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const PASSWORD_REXP = /^(?=.*\d)(?=.*\D)[\S\s]{8,16}$/;
        const JP_FULLSIZE_REXP = /[ァ-ン０-９Ａ-ｚァ-ヶ]/;

        if (!JP_FULLSIZE_REXP.test(control.value) && PASSWORD_REXP.test(control.value)) {
            return null;
        } else {
            return {'pass-validator': {value: control.value}};
        }
    };
}

export function validateMail(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        // check email
        const mail = nameRe.test(control.value);
        if (!mail) {
            return {'mail-validator': {value: control.value}};
        }
        return null;
    };
}

export function validateCharNum(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        // check character and number requried input
        const charNum = nameRe.test(control.value);
        if (!charNum) {
            return {'charNumber-validator': {value: control.value}};
        }
        return null;
    };
}
