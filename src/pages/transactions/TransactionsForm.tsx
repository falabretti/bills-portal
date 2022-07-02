import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputLabel, makeStyles, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { FormEvent, ReactElement, useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import DatePicker from '../../components/DatePicker';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Notification, { NotificationState } from '../../components/Notification';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { Account, ApiError, Category, getAccounts, getExpenseCategories, getIncomeCategories, Transaction, TransactionType } from '../../services/client';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import { toLocaleDate } from '../../utils/formatUtils';
import { notEmpty, notNull } from '../../utils/validationUtils';

export type TransactionFields = {
    accountId: number,
    categoryId: number,
    type: TransactionType,
    description: string,
    transactionDate: Date,
    value: number | undefined
    [key: string]: string | number | undefined | Date
}

const initialFieldValues: TransactionFields = {
    accountId: 0,
    categoryId: 0,
    type: 'INCOME',
    description: '',
    transactionDate: new Date(),
    value: undefined
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

type TransactionsFormProps = {
    onSubmit: (values: TransactionFields, id?: number) => void,
    editRecord: Transaction | undefined
}

export default function TransactionsForm(props: TransactionsFormProps): ReactElement {

    const { onSubmit, editRecord } = props;

    const classes = useStyles();

    const { values, setValues, errors, handleInput, handleCustomInput } = useForm(initialFieldValues, handleValidation);
    const { user } = useContext(UserContext) as UserContextType;
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

    function handleValidation(name: string, value: FormFieldValue): string {

        if (name === 'value') {
            const error = notEmpty(value) ? '' : 'Valor é obrigatório';
            if (error)
                return error;

            const fieldValue = (value as unknown) as string;
            return parseFloat(fieldValue) >= 0 ? '' : 'O valor deve ser positivo';
        }

        if (name === 'description') {
            return notEmpty(value) ? '' : 'Descrição é obrigatória';
        }

        if (name === 'transactionDate') {
            return notNull(value) ? '' : 'Data da transação é obrigatória'
        }

        if (name === 'categoryId') {
            const categoryId = (value as unknown) as number;
            return categoryId != 0 ? '' : 'Categoria é obrigatória';
        }

        if (name === 'accountId') {
            const accountId = (value as unknown) as number;
            return accountId != 0 ? '' : 'Conta é obrigatória';
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

    function loadCategories() {
        user && getIncomeCategories(user.id)
            .then(res => {
                setIncomeCategories(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar dados!') });
                console.error(error);
            });

        user && getExpenseCategories(user.id)
            .then(res => {
                setExpenseCategories(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar dados!') });
                console.error(error);
            });
    }

    function loadAccounts() {
        user && getAccounts(user.id)
            .then(res => {
                setAccounts(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar dados!') });
                console.error(error);
            });
    }

    useEffect(() => {
        loadCategories();
        loadAccounts();
    }, []);

    useEffect(() => {
        if (editRecord) {
            setValues({
                accountId: editRecord.accountId,
                categoryId: editRecord.categoryId,
                type: editRecord.type,
                description: editRecord.description,
                transactionDate: toLocaleDate(editRecord.transactionDate),
                value: editRecord.value
            });
        }
    }, [editRecord]);

    const categories = values.type === 'INCOME' ? incomeCategories : expenseCategories;
    const availableCategories = categories.map(cat => cat.id);
    const availableAccounts = accounts.map(acc => acc.id);

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Input name="value" label="Valor" value={values.value} error={errors.value} onChange={handleInput} currency />
                        <Input name="description" label="Descrição" value={values.description} error={errors.description} onChange={handleInput} />
                        <FormControl>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup row name="type" value={values.type} onChange={handleInput}>
                                <FormControlLabel disabled={Boolean(editRecord)} label="Receita" value="INCOME" control={<Radio />} />
                                <FormControlLabel disabled={Boolean(editRecord)} label="Despesa" value="EXPENSE" control={<Radio />} />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker name="transactionDate" label="Data" value={values.transactionDate} error={errors.transactionDate} onChange={handleCustomInput} />
                        <FormControl variant="outlined" fullWidth error={Boolean(errors.categoryId)}>
                            <InputLabel>Categoria</InputLabel>
                            <Select name="categoryId" label="Categoria"
                                value={availableCategories.includes(values.categoryId) && values.categoryId || 0}
                                onChange={e => handleCustomInput({ name: e.target.name as string, value: e.target.value as FormFieldValue })}>
                                <MenuItem value={0}>Nenhum</MenuItem>
                                {
                                    categories.map(category => (
                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                    ))
                                }
                            </Select>
                            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
                        </FormControl>
                        <FormControl variant="outlined" fullWidth error={Boolean(errors.accountId)}>
                            <InputLabel>Conta</InputLabel>
                            <Select name="accountId" label="Conta"
                                value={availableAccounts.includes(values.accountId) && values.accountId || 0}
                                onChange={e => handleCustomInput({ name: e.target.name as string, value: e.target.value as FormFieldValue })}>
                                <MenuItem value={0}>Nenhum</MenuItem>
                                {
                                    accounts.map(account => (
                                        <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
                                    ))
                                }
                            </Select>
                            {errors.accountId && <FormHelperText>{errors.accountId}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>
                <div className={classes.controls}>
                    <Button variant="contained" color="default" size="medium" onClick={() => setValues({ ...initialFieldValues, type: editRecord && editRecord.type || initialFieldValues.type })}>
                        Limpar
                    </Button>
                    <Button variant="contained" color="primary" size="medium" type="submit">
                        Salvar
                    </Button>
                </div>
            </Form>
            <Notification state={notification} setState={setNotification} />
        </>
    );
}
