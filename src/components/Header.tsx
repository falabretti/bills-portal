import { AppBar, IconButton, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, PopoverOrigin, Toolbar, Typography } from '@material-ui/core';
import React, { MouseEvent, useContext, useState } from 'react'
import { ReactElement } from 'react';
import { UserContext, UserContextType } from '../contexts/UserContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    title: {
        flexGrow: 1
    }
}));

type HeaderProps = {
    title: string
}

export default function Header(props: HeaderProps): ReactElement {

    const classes = useStyles();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const open = Boolean(menuAnchor);

    const { user, setUser } = useContext(UserContext) as UserContextType;

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    }

    const handleLogout = () => {
        setUser(undefined);
    }

    const menuAnchorPosition: PopoverOrigin = {
        vertical: 'top',
        horizontal: 'right'
    }

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    {props.title}
                </Typography>
                <div>
                    <IconButton color="inherit" onClick={handleOpenMenu}>
                        <AccountCircleIcon />&nbsp;
                        <Typography>{user?.firstName}</Typography>
                    </IconButton>
                    <Menu open={open} anchorEl={menuAnchor} keepMounted onClose={handleCloseMenu} anchorOrigin={menuAnchorPosition} transformOrigin={menuAnchorPosition}>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
                            <ListItemText primary={'Sair'} />
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}
