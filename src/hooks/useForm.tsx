import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

export type FormFieldValue = string | Date | number | undefined | null;

export type InputChangeEvent = {
    name: string,
    value: FormFieldValue
}

type HandleValidationFunction = (name: string, value: FormFieldValue) => string;

type UseFormType<Type> = {
    values: Type,
    setValues: Dispatch<SetStateAction<Type>>,
    errors: Record<string, string>,
    handleInput: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    handleCustomInput: (event: InputChangeEvent) => void
}

export default function useForm<Type>(initialValues: Type, handleValidation?: HandleValidationFunction): UseFormType<Type> {

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        handleCustomInput(translateEvent(event));
    };

    const handleCustomInput = (event: InputChangeEvent) => {
        const { name, value } = event;
        setValues({
            ...values,
            [name]: value
        });

        const error = handleValidation && handleValidation(name, value);
        setErrors({
            ...errors,
            [name]: error
        })
    }

    return {
        values,
        setValues,
        errors,
        handleInput,
        handleCustomInput
    }
}

export function translateEvent(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): InputChangeEvent {
    const { name, value } = event.currentTarget;
    return { name, value };
}
