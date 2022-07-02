import { Container, makeStyles, Toolbar } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { ReactElement } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    content: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

type PageProps = {
    title: string,
    children: ReactNode
}

export default function Page(props: PageProps): ReactElement {

    const { title, children } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Header title={title} />
            <Sidebar />
            <Container maxWidth="lg" className={classes.content}>
                <Toolbar />
                {children}
            </Container>
        </div>
    );
}
