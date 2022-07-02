import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

type PaperCardProps = {
    children: ReactNode
}

const useStyles = makeStyles(theme => ({
    paperRoot: {
        padding: theme.spacing(4)
    }
}));

export default function PaperCard(props: PaperCardProps): ReactElement {

    const classes = useStyles();

    return (
        <Paper elevation={3} classes={{ root: classes.paperRoot }}>
            {props.children}
        </Paper>
    )
}
