import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { FormEvent, ReactElement } from 'react';
import DatePicker from '../../components/DatePicker';
import Form from '../../components/Form';
import Input from '../../components/Input';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { Account, Category, TransactionType } from '../../services/client';

export type TransactionFilterFields = {
    description: string,
    type: TransactionType | '',
    accountId: number | undefined,
    categoryId: number | undefined,
    dateFrom: Date | null,
    dateTo: Date | null
}

type TransactionFilterProps = {
    onSubmit: (values: TransactionFilterFields) => void,
    accounts: Account[],
    categories: Category[]
}

const initialFieldValues: TransactionFilterFields = {
    description: '',
    type: '',
    accountId: 0,
    categoryId: 0,
    dateFrom: null,
    dateTo: null
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

export default function TransactionFilterForm(props: TransactionFilterProps): ReactElement {

    const { onSubmit, accounts, categories } = props;

    const classes = useStyles();
    const { values, setValues, handleInput, handleCustomInput } = useForm(initialFieldValues);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit({
            ...values,
            accountId: values.accountId !== 0 && values.accountId || undefined,
            categoryId: values.categoryId !== 0 && values.categoryId || undefined
        });
    }

    const availableAccounts = accounts.map(acc => acc.id);
    const availableCategories = categories.map(cat => cat.id);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Filtrar
            </Typography>
            <Form className={classes.form} onSubmit={handleSubmit}>
                <div>
                    <Input name="description" label="Descrição" value={values.description} onChange={handleInput} />
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
                        <InputLabel>Conta</InputLabel>
                        <Select name="accountId" label="Conta"
                            value={availableAccounts.includes(values.accountId as number) && values.accountId || 0}
                            onChange={e => handleCustomInput({ name: e.target.name as string, value: e.target.value as FormFieldValue })}>
                            <MenuItem value={0}>Nenhum</MenuItem>
                            {
                                accounts.map(account => (
                                    <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                                ))
                            }
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
                    <DatePicker name="dateFrom" label="A partir de" value={values.dateFrom as Date} onChange={handleCustomInput} />
                    <DatePicker name="dateTo" label="Até" value={values.dateTo as Date} onChange={handleCustomInput} />
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
