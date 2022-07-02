import React, { ReactElement } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string,
    label: string,
    value: string | number | undefined,
    error?: string,
    currency?: boolean
}

export default function Input(props: InputProps): ReactElement {

    const { name, label, value, error, onChange, currency } = props;

    return (
        <TextField
            variant="outlined"
            fullWidth

            name={name}
            label={label}
            value={value}
            onChange={onChange}
            InputProps={{
                startAdornment: currency && <InputAdornment position="start">R$</InputAdornment>
            }}
            {...(error && { error: true, helperText: error })}
            {...(currency && { type: 'number' })}
        />
    );
}
