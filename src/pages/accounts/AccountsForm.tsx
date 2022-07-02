import { Button, makeStyles, } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { useEffect } from 'react';
import { FormEvent } from 'react';
import Form from '../../components/Form';
import Input from '../../components/Input';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { Account } from '../../services/client';
import { notEmpty } from '../../utils/validationUtils';


export type AccountFields = {
    name: string,
    [key: string]: string
}

const initialFieldValues: AccountFields = {
    name: ''
}

const useStyles = makeStyles(theme => ({
    controls: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button': {
            marginLeft: theme.spacing(1)
        }
    }
}));

type AccountsFormProps = {
    onSubmit: (values: AccountFields, id?: number) => void,
    editRecord: Account | undefined
}

export default function AccountsForm(props: AccountsFormProps): ReactElement {

    const { onSubmit, editRecord } = props;

    const classes = useStyles();
    const { values, setValues, errors, handleInput } = useForm(initialFieldValues, handleValidation);

    function handleValidation(name: string, value: FormFieldValue): string {

        if (name === 'name') {
            return notEmpty(value) ? '' : 'Nome é obrigatório';
        }

        return '';
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validForm = Object.keys(values).every(key => handleValidation(key, values[key]) === '');
        if (!validForm) {
            return;
        }

        onSubmit({ ...values }, editRecord?.id);
        setValues(initialFieldValues);
    }

    useEffect(() => {
        if (editRecord) {
            setValues({ name: editRecord.name });
        }
    }, [editRecord]);

    return (
        <Form onSubmit={handleSubmit}>
            <Input name="name" label="Nome" value={values.name} error={errors.name} onChange={handleInput} />
            <div className={classes.controls}>
                <Button variant="contained" color="default" size="medium" onClick={() => setValues(initialFieldValues)}>
                    Limpar
                </Button>
                <Button variant="contained" color="primary" size="medium" type="submit">
                    Salvar
                </Button>
            </div>
        </Form>
    );
}
