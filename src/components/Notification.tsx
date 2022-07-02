import { Snackbar, SnackbarCloseReason, Typography } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
import React from 'react';
import { ReactElement } from 'react';

export type NotificationState = {
    open: boolean,
    message: string,
    details?: string,
    severity: Color
}

type NotificationProps = {
    state: NotificationState,
    setState: React.Dispatch<React.SetStateAction<NotificationState>>
}

export default function Notification(props: NotificationProps): ReactElement {

    const { state, setState } = props;

    const handleClose = (event: React.SyntheticEvent, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({
            ...state,
            open: false
        });
    }

    return (
        <Snackbar open={state.open} autoHideDuration={3000} onClose={handleClose}>
            <Alert severity={state.severity} elevation={6} variant="filled" onClose={handleClose}>
                <Typography variant="subtitle1">
                    {state.message}
                </Typography>
                {state.details &&
                    <Typography variant="caption">
                        Detalhes: {state.details}
                    </Typography>
                }
            </Alert>
        </Snackbar>
    );
}
