import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { FormEvent, ReactElement } from 'react';
import Form from '../../components/Form';
import Input from '../../components/Input';
import useForm from '../../hooks/useForm';

export type AccountFilterFields = {
    name: string,
}

type AccountFilterProps = {
    onSubmit: (values: AccountFilterFields) => void,
}

const initialFieldValues: AccountFilterFields = {
    name: ''
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

export default function AccountFilterForm(props: AccountFilterProps): ReactElement {

    const { onSubmit } = props;

    const classes = useStyles();
    const { values, setValues, handleInput } = useForm(initialFieldValues);

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
                    <Input name="name" label="Nome" value={values.name} onChange={handleInput} />
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
