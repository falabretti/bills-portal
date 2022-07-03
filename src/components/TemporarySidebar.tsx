import { Drawer, makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { ReactElement } from 'react';

type TemporarySidebarProps = {
    open: boolean,
    onClose: () => void,
    children: ReactNode
}

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 340,
        flexShrink: 0
    },
    drawerPaper: {
        width: 340,
        padding: theme.spacing(2)
    }
}));

export default function TemporarySidebar(props: TemporarySidebarProps): ReactElement {

    const classes = useStyles();
    const { open, onClose, children } = props;

    return (
        <Drawer anchor="right" open={open} onClose={onClose} className={classes.drawer} classes={{ paper: classes.drawerPaper }} keepMounted>
            {children}
        </Drawer>
    );
}
