import React, { ReactElement, FormEvent, MouseEvent, useState } from 'react'
import { Button, Container, Link, makeStyles, Typography } from '@material-ui/core'
import PaperCard from '../components/PaperCard';
import UnauthenticatedHeader from '../components/UnauthenticatedHeader';
import useForm, { FormFieldValue } from '../hooks/useForm';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { notEmpty, validEmail } from '../utils/validationUtils';
import Input from '../components/Input';
import { ApiError, getUser } from '../services/client';
import { useContext } from 'react';
import { UserContext, UserContextType } from '../contexts/UserContext';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import Notification, { NotificationState } from '../components/Notification';
import { buildErrorMessage, notify } from '../utils/componentUtils';

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

type LoginFields = {
    email: string,
    [key: string]: string
}

const defaultFieldValues: LoginFields = {
    email: ''
}

export default function Login(): ReactElement {

    const classes = useStyles();
    const { values, errors, handleInput } = useForm(defaultFieldValues, handleValidation);
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validForm = Object.keys(values).every(key => handleValidation(key, values[key]) === '');
        if (!validForm) {
            return;
        }

        getUser(values.email)
            .then(res => {
                setUser(res.data);
                navigate("/home")
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao realizar log in!') });
                console.error(error);
            });
    }

    const handleRedirect = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        navigate('/register');
    }

    function handleValidation(name: string, value: FormFieldValue): string {

        if (name === 'email') {
            const error = notEmpty(value) ? '' : 'E-mail é obrigatório';
            if (error)
                return error;

            return validEmail(value) ? '' : 'Formato de e-mail inválido'
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
                        Não tem uma conta?&nbsp;
                        <Link variant="subtitle1" underline="none" href="/register" onClick={handleRedirect}>
                            Registre-se
                        </Link>
                    </Typography>
                </UnauthenticatedHeader>
                <Container maxWidth="sm">
                    <div className={classes.root}>
                        <PaperCard>
                            <Typography variant="h4" component="h1">
                                Entre no Bills
                            </Typography>
                            <Typography variant="body1">
                                Insira suas informações de acesso
                            </Typography>
                            <Form onSubmit={handleSubmit} className={classes.form}>
                                <Input name="email" label="E-mail" value={values.email} error={errors.email} onChange={handleInput} />
                                <Button variant="contained" color="primary" size="large" type="submit">
                                    Entrar
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
