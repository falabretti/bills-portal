import { makeStyles } from '@material-ui/core';
import React, { ReactElement, ReactNode } from 'react';

type UnauthenticatedHeaderProps = {
    children: ReactNode
}

const useStyles = makeStyles({
    header: {
        position: 'absolute',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    headerText: {
        marginTop: '3em',
        marginRight: '3em'
    }
});

export default function UnauthenticatedHeader(props: UnauthenticatedHeaderProps): ReactElement {

    const classes = useStyles();

    return (
        <header className={classes.header}>
            <div className={classes.headerText}>
                {props.children}
            </div>
        </header>
    )
}
