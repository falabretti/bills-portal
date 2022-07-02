import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { ReactNode } from 'react';
import CloseIcon from '@material-ui/icons/Close';

type PopUpProps = {
    title: string,
    open: boolean,
    onClose: () => void,
    children: ReactNode
    actions?: ReactNode,
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: theme.spacing(20)
    },
    title: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

export default function PopUp(props: PopUpProps): ReactElement {

    const { title, open, onClose, children, actions, maxWidth } = props;
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={onClose} classes={{ paper: classes.root }} maxWidth={maxWidth || 'sm'} fullWidth>
            <DialogTitle disableTypography className={classes.title}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            {actions && <DialogActions>
                {actions}
            </DialogActions>}
        </Dialog>
    );
}
