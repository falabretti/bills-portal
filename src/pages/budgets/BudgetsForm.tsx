import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputLabel, makeStyles, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import DatePicker from '../../components/DatePicker';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Notification, { NotificationState } from '../../components/Notification';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import useForm, { FormFieldValue } from '../../hooks/useForm';
import { ApiError, Budget, Category, getExpenseCategories, getIncomeCategories, TransactionType } from '../../services/client';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import { toLocaleDate } from '../../utils/formatUtils';
import { notEmpty, notNull } from '../../utils/validationUtils';

export type BudgetFields = {
    value: number | undefined,
    month: Date,
    type: TransactionType,
    categoryId: number,
    [key: string]: string | number | undefined | Date
}

const initialFieldValues: BudgetFields = {
    value: undefined,
    month: new Date(),
    type: 'INCOME',
    categoryId: 0
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

type BudgetsFormProps = {
    onSubmit: (values: BudgetFields, id?: number) => void,
    editRecord: Budget | undefined
}

export default function BudgetsForm(props: BudgetsFormProps): ReactElement {

    const { onSubmit, editRecord } = props;

    const classes = useStyles();

    const { values, setValues, errors, handleInput, handleCustomInput } = useForm(initialFieldValues, handleValidation);
    const { user } = useContext(UserContext) as UserContextType;
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

    function handleValidation(name: string, value: FormFieldValue): string {
        if (name === 'value') {
            const error = notEmpty(value) ? '' : 'Valor é obrigatório';
            if (error)
                return error;

            const fieldValue = (value as unknown) as string;
            return parseFloat(fieldValue) >= 0 ? '' : 'O valor deve ser positivo';
        }

        if (name === 'month') {
            return notNull(value) ? '' : 'Mês do orçamento é obrigatório'
        }

        if (name === 'categoryId') {
            const categoryId = (value as unknown) as number;
            return categoryId != 0 ? '' : 'Categoria é obrigatória';
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

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (editRecord) {
            setValues({
                value: editRecord.value,
                month: toLocaleDate(editRecord.month),
                type: editRecord.type,
                categoryId: editRecord.categoryId
            });
        }
    }, [editRecord]);

    const categories = values.type === 'INCOME' ? incomeCategories : expenseCategories;
    const availableCategories = categories.map(cat => cat.id);

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Input name="value" label="Valor" value={values.value} error={errors.value} onChange={handleInput} currency />
                        <FormControl>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup row name="type" value={values.type} onChange={handleInput}>
                                <FormControlLabel disabled={Boolean(editRecord)} label="Receita" value="INCOME" control={<Radio />} />
                                <FormControlLabel disabled={Boolean(editRecord)} label="Despesa" value="EXPENSE" control={<Radio />} />
                            </RadioGroup>
                        </FormControl>   
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker name="month" label="Mês" value={values.month} error={errors.month} onChange={handleCustomInput} />
                        <FormControl variant="outlined" fullWidth error={Boolean(errors.categoryId)}>
                            <InputLabel>Categoria</InputLabel>
                            <Select name="categoryId" label="Categoria" disabled={Boolean(editRecord)}
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
