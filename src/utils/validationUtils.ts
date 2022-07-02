import { FormFieldValue } from '../hooks/useForm';

export function notEmpty(value: FormFieldValue): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    return value.length > 0;
}

export function validEmail(value: FormFieldValue): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    return notEmpty(value) && (/.+@.+\..+/).test(value);
}

export function notNull(value: FormFieldValue): boolean {
    return value !== null && value !== undefined;
}
