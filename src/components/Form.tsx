import { makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { FormHTMLAttributes } from 'react';
import { ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode
}

const useStyles = makeStyles(theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        '& .MuiFormControl-root': {
            marginBottom: theme.spacing(2)
        }
    }
}));

export default function Form(props: FormProps): ReactElement {

    const { onSubmit, className, ...other } = props;

    const classes = useStyles();

    return (
        <form className={`${classes.form} ${className}`} autoComplete="off" onSubmit={onSubmit} {...other}>
            {props.children}
        </form>
    );
}
