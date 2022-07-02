import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Toolbar } from '@material-ui/core';
import React, { MouseEvent, ReactElement } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import LabelIcon from '@material-ui/icons/Label';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import HistoryIcon from '@material-ui/icons/History';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { useLocation, useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
    drawer: {
        width: 240,
        flexShrink: 0
    },
    drawerPaper: {
        width: 240
    }
});

export default function Sidebar(): ReactElement {

    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();

    const handleRedirect = (event: MouseEvent<HTMLElement>, path: string) => {
        event.preventDefault();
        navigate(path);
    }
    const menus = [
        {
            path: '/home',
            text: 'Home',
            icon: HomeIcon
        },
        {
            path: '/transactions',
            text: 'Transações',
            icon: ShowChartIcon
        },
        {
            path: '/accounts',
            text: 'Contas',
            icon: AccountBalanceWalletIcon
        },
        {
            path: '/categories',
            text: 'Categorias',
            icon: LabelIcon
        },
        {
            path: '/history',
            text: 'Histórico',
            icon: HistoryIcon
        }
    ]

    return (
        <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawerPaper }}>
            <Toolbar />
            <List>
                {menus.map(({ path, text, icon: Icon }) => (
                    <ListItem button key={text} selected={location.pathname === path} onClick={e => handleRedirect(e, path)}>
                        <ListItemIcon><Icon /></ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
