import React, { ReactNode, useEffect } from 'react';
import { useContext } from 'react';
import { ReactElement } from 'react';
import { Route } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '../contexts/UserContext';

type SecureRouteProps = {
    path: string,
    children: ReactNode
}

export default function SecureRoute(props: SecureRouteProps): ReactElement {

    const { path, children } = props;
    const { user } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    return (
        user ?
        <Route path={path}>
            {children}
        </Route>
        : <></>
    );
}
