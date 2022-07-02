import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { ReactElement } from 'react';
import { InputChangeEvent } from '../hooks/useForm';
import ptBR from 'date-fns/locale/pt-BR';

type DatePickerProps = {
    name: string,
    label: string,
    value: Date,
    error?: string,
    disableFuture?: boolean
    onChange: (event: InputChangeEvent) => void
}

export default function DatePicker(props: DatePickerProps): ReactElement {

    const { name, label, value, error, disableFuture = false, onChange } = props;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
            <KeyboardDatePicker
                variant="inline"
                inputVariant="outlined"
                format="dd/MM/yyyy"
                disableFuture={disableFuture}
                fullWidth
                
                name={name}
                label={label}
                value={value}
                onChange={date => onChange({ name, value: date })}
                {...(error && { error: true, helperText: error })}
            />
        </MuiPickersUtilsProvider>
    );
}
