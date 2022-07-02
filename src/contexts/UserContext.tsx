import React, { ReactElement, ReactNode } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    dateOfBirth: string,
    age: number
}

export type UserContextType = {
    user?: User,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
};

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
    children: ReactNode
}

export function UserProvider(props: UserProviderProps): ReactElement {

    const [user, setUser] = useState<User | undefined>(undefined);
    const value = useMemo<UserContextType>(() => ({ user, setUser }), [user, setUser]);

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}
