import { Button, Container, Link, makeStyles, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { FormEvent, ReactElement, MouseEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import DatePicker from '../components/DatePicker';
import Form from '../components/Form';
import Input from '../components/Input';
import Notification, { NotificationState } from '../components/Notification';
import PaperCard from '../components/PaperCard';
import UnauthenticatedHeader from '../components/UnauthenticatedHeader';
import { UserContext, UserContextType } from '../contexts/UserContext';
import useForm, { FormFieldValue } from '../hooks/useForm';
import { ApiError, createUser } from '../services/client';
import { buildErrorMessage, notify } from '../utils/componentUtils';
import { notEmpty, notNull, validEmail } from '../utils/validationUtils';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh'
    },
    form: {
        marginTop: theme.spacing(4),
    }
}));

export type RegisterFields = {
    firstName: string,
    lastName: string,
    email: string,
    dateOfBirth: Date,
    [key: string]: string | Date
}

const defaultFieldValues: RegisterFields = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: new Date()
}

export default function Register(): ReactElement {

    const classes = useStyles();
    const { values, errors, handleInput, handleCustomInput } = useForm(defaultFieldValues, handleValidation);
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validForm = Object.keys(values).every(key => handleValidation(key, values[key]) === '');
        if (!validForm) {
            return;
        }

        createUser(values)
            .then(res => {
                setUser(res.data);
                navigate("/home");
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao realizar registro!') });
                console.error(error);
            });
    }

    const handleRedirect = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        navigate('/login');
    }

    function handleValidation(name: string, value: FormFieldValue): string {

        if (name === 'firstName') {
            return notEmpty(value) ? '' : 'Nome é obrigatório';
        }

        if (name === 'lastName') {
            return notEmpty(value) ? '' : 'Sobrenome é obrigatório';
        }

        if (name === 'email') {
            const error = notEmpty(value) ? '' : 'E-mail é obrigatório';
            if (error)
                return error;

            return validEmail(value) ? '' : 'Formato de e-mail inválido'
        }

        if (name === 'dateOfBirth') {
            return notNull(value) ? '' : 'Data de nascimento é obrigatória'
        }

        return '';
    }

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user]);

    return (
        !user ?
            <>
                <UnauthenticatedHeader>
                    <Typography variant="body1">
                        Já tem uma conta?&nbsp;
                        <Link variant="subtitle1" underline="none" href="/login" onClick={handleRedirect}>
                            Entre aqui
                        </Link>
                    </Typography>
                </UnauthenticatedHeader>
                <Container maxWidth="sm">
                    <div className={classes.root}>
                        <PaperCard>
                            <Typography variant="h4" component="h1">
                                Crie sua conta no Bills
                            </Typography>
                            <Typography variant="body1">
                                Insira seus dados
                            </Typography>
                            <Form onSubmit={handleSubmit} className={classes.form}>
                                <Input name="firstName" label="Nome" value={values.firstName} error={errors.firstName} onChange={handleInput} />
                                <Input name="lastName" label="Sobrenome" value={values.lastName} error={errors.lastName} onChange={handleInput} />
                                <Input name="email" label="E-mail" value={values.email} error={errors.email} onChange={handleInput} />
                                <DatePicker name="dateOfBirth" label="Data de Nascimento" value={values.dateOfBirth} error={errors.dateOfBirth} onChange={handleCustomInput} disableFuture />
                                <Button variant="contained" color="primary" size="large" type="submit">
                                    Registrar
                                </Button>
                            </Form>
                        </PaperCard>
                    </div>
                </Container>
                <Notification state={notification} setState={setNotification} />
            </>
            :
            <></>
    );
}
