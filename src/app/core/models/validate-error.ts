export class ValidateError {
    errors: {
        constraints: {[name: string]: string}
    }[];
    type: 0 | 1;
}
