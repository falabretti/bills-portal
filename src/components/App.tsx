import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '../contexts/UserContext';
import AccountsPage from '../pages/accounts/AccountsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import HistoryPage from '../pages/history/HistoryPage';
import HomePage from '../pages/home/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TransactionsPage from '../pages/transactions/TransactionsPage';
import SecureRoute from './SecureRoute';

const theme = createTheme({
    palette: {
        background: {
            default: '#f5f5f5'
        }
    },
    typography: {
        subtitle1: {
            fontWeight: 600
        }
    }
});

export default function App(): ReactElement {
    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/">
                            <Navigate to="/home" />
                        </Route>
                        <SecureRoute path="/home">
                            <HomePage />
                        </SecureRoute>
                        <SecureRoute path="/transactions">
                            <TransactionsPage />
                        </SecureRoute>
                        <SecureRoute path="/accounts">
                            <AccountsPage />
                        </SecureRoute>
                        <SecureRoute path="/categories">
                            <CategoriesPage />
                        </SecureRoute>
                        <SecureRoute path="/history">
                            <HistoryPage />
                        </SecureRoute>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                    </Routes>
                    <CssBaseline />
                </BrowserRouter>
            </UserProvider>
        </ThemeProvider>
    );
}
