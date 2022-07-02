import { Typography } from '@material-ui/core';
import React, { ReactElement } from 'react'
import { useContext } from 'react';
import { UserContext, UserContextType } from '../../contexts/UserContext';

export default function Home(): ReactElement {

    const { user } = useContext(UserContext) as UserContextType;

    return (
        <Typography variant="h4" gutterBottom>
            Bem vindo(a),<br />{user?.fullName}
        </Typography>
    );
}
