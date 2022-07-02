import { Button, Dialog, DialogActions, DialogContent, makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';

export type ConfirmDialogState = {
    open: boolean,
    title: string,
    subtitle?: string,
    onConfirm: () => void
}

type ConfirmDialogProps = {
    state: ConfirmDialogState,
    setState: React.Dispatch<React.SetStateAction<ConfirmDialogState>>
}

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: theme.spacing(20)
    },
}));

export default function ConfirmDialog(props: ConfirmDialogProps): ReactElement {

    const { state, setState } = props;
    const classes = useStyles();

    const handleClose = () => {
        setState({
            ...state,
            open: false
        });
    }

    return (
        <Dialog open={state.open} classes={{ paper: classes.root }}>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    {state.title}
                </Typography>
                <Typography variant="body1">
                    {state.subtitle}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button color="default" variant="contained" onClick={handleClose}>
                    Não
                </Button>
                <Button color="secondary" variant="contained" onClick={state.onConfirm}>
                    Sim
                </Button>
            </DialogActions>
        </Dialog>
    );
}
