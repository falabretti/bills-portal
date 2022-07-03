import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { FormEvent } from 'react';
import { ReactElement } from 'react';
import Form from '../../components/Form';
import Input from '../../components/Input';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { TransactionType } from '../../services/client';

export type CategoryFilterFields = {
    name: string,
    type: TransactionType | '',
}

type CategoryFilterProps = {
    onSubmit: (values: CategoryFilterFields) => void,
}

const initialFieldValues: CategoryFilterFields = {
    name: '',
    type: ''
}

const useStyles = makeStyles(theme => ({
    form: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    formControls: {
        display: 'flex',
        flexDirection: 'column',
        '& button': {
            marginTop: theme.spacing(1)
        }
    }
}));

export default function CategoryFilterForm(props: CategoryFilterProps): ReactElement {

    const { onSubmit } = props;

    const classes = useStyles();
    const { values, setValues, handleInput, handleCustomInput } = useForm(initialFieldValues);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({ ...values });
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Filtrar
            </Typography>
            <Form className={classes.form} onSubmit={handleSubmit}>
                <div>
                    <Input name="name" label="Descrição" value={values.name} onChange={handleInput} />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select name="type" label="Tipo"
                            value={values.type}
                            onChange={e => handleCustomInput({ name: e.target.name as string, value: e.target.value as FormFieldValue })}>
                            <MenuItem value={''}>Nenhum</MenuItem>
                            <MenuItem value={'INCOME'}>Receita</MenuItem>
                            <MenuItem value={'EXPENSE'}>Despesa</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={classes.formControls}>
                    <Button variant="contained" color="default" size="medium" onClick={() => setValues(initialFieldValues)}>
                        Limpar
                    </Button>
                    <Button variant="contained" color="primary" size="medium" type="submit">
                        Salvar
                    </Button>
                </div>
            </Form>
        </>
    );
}
