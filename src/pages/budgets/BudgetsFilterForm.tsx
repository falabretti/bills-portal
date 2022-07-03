import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { FormEvent, ReactElement } from 'react';
import Form from '../../components/Form';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { Category, TransactionType } from '../../services/client';

export type BudgetsFilterFields = {
    type: TransactionType | '',
    categoryId: number | undefined
}

type BudgetsFilterProps = {
    onSubmit: (values: BudgetsFilterFields) => void,
    categories: Category[]
}

const initialFieldValues: BudgetsFilterFields = {
    type: '',
    categoryId: 0
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

export default function BudgetsFilterForm(props: BudgetsFilterProps): ReactElement {

    const { onSubmit, categories } = props;

    const classes = useStyles();
    const { values, setValues, handleCustomInput } = useForm(initialFieldValues);
    

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            ...values,
            categoryId: values.categoryId !== 0 && values.categoryId || undefined
        });
    }

    const availableCategories = categories.map(cat => cat.id);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Filtrar
            </Typography>
            <Form className={classes.form} onSubmit={handleSubmit}>
                <div>
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
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Categoria</InputLabel>
                        <Select name="categoryId" label="Categoria"
                            value={availableCategories.includes(values.categoryId as number) && values.categoryId || 0}
                            onChange={e => handleCustomInput({ name: e.target.name as string, value: e.target.value as FormFieldValue })}>
                            <MenuItem value={0}>Nenhum</MenuItem>
                            {
                                categories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))
                            }
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
