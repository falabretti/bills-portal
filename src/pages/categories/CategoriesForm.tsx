import { Button, FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import React, { FormEvent, useEffect } from 'react';
import { ReactElement } from 'react';
import Form from '../../components/Form';
import Input from '../../components/Input';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { Category, TransactionType } from '../../services/client';
import { notEmpty } from '../../utils/validationUtils';

export type CategoryFields = {
    name: string,
    type: TransactionType,
    [key: string]: string
}

const initialFieldValues: CategoryFields = {
    name: '',
    type: 'INCOME'
}

type CategoriesFormProps = {
    onSubmit: (values: CategoryFields, id?: number) => void,
    editRecord: Category | undefined
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

export default function CategoriesForm(props: CategoriesFormProps): ReactElement {

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
            setValues({
                name: editRecord.name,
                type: editRecord.type
            });
        }
    }, [editRecord]);

    return (
        <Form onSubmit={handleSubmit}>
            <Input name="name" label="Nome" value={values.name} error={errors.name} onChange={handleInput} />
            <FormControl>
                <FormLabel>Tipo</FormLabel>
                <RadioGroup row name="type" value={values.type} onChange={handleInput}>
                    <FormControlLabel disabled={Boolean(editRecord)} label="Receita" value="INCOME" control={<Radio />} />
                    <FormControlLabel disabled={Boolean(editRecord)} label="Despesa" value="EXPENSE" control={<Radio />} />
                </RadioGroup>
            </FormControl>
            <div className={classes.controls}>
                <Button variant="contained" color="default" size="medium" onClick={() => setValues({ ...initialFieldValues, type: editRecord && editRecord.type || initialFieldValues.type })}>
                    Limpar
                </Button>
                <Button variant="contained" color="primary" size="medium" type="submit">
                    Salvar
                </Button>
            </div>
        </Form>
    );
}
