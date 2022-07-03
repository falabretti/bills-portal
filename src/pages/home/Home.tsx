import { Card, CardContent, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement, useEffect, useState } from 'react'
import { useContext } from 'react';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import { ApiError, Balance, getBalance, getMonthBalance, MonthBalance } from '../../services/client';
import { toCurrency, toLocaleDateString } from '../../utils/formatUtils';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TodayIcon from '@material-ui/icons/Today';
import Notification, { NotificationState } from '../../components/Notification';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import { AxiosError } from 'axios';

const useStyles = makeStyles(theme => ({
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    cardText: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        '& h5': {
            marginTop: '1em'
        }
    },
    cardIcon: {
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    },
    balanceIcon: {
        color: '#179428',
    },
    monthIcon: {
        color: theme.palette.primary.main,
    },
    positiveValue: {
        color: '#179428',
        fontSize: '2.5em'
    },
    negativeValue: {
        color: '#CE6060',
        fontSize: '2.5em'
    }
}));

export default function Home(): ReactElement {

    const classes = useStyles();
    const { user } = useContext(UserContext) as UserContextType;
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });
    const [balance, setBalance] = useState<Balance>();
    const [monthBalance, setMonthBalance] = useState<MonthBalance>();

    const loadBalance = () => {
        user && getBalance(user.id)
            .then(res => {
                setBalance(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar informações!') });
                console.error(error);
            });
    }

    const loadMonthBalance = () => {
        user && getMonthBalance(user.id)
            .then(res => {
                setMonthBalance(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar informações!') });
                console.error(error);
            });
    }

    useEffect(() => {
        loadBalance();
        loadMonthBalance();
    }, []);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Bem vindo(a),<br />{user?.fullName}
            </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent className={classes.cardContent}>
                            <div className={classes.cardText}>
                                <Typography variant="h5">
                                    Saldo Total
                                </Typography>
                                {
                                    balance && <Typography className={balance.value >= 0 ? classes.positiveValue : classes.negativeValue}>
                                        {toCurrency(balance.value)}
                                    </Typography>
                                }
                            </div>
                            <div>
                                <IconButton disableRipple className={`${classes.cardIcon} ${classes.balanceIcon}`}>
                                    <MonetizationOnIcon />
                                </IconButton>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent className={classes.cardContent}>
                            <div className={classes.cardText}>
                                <div>
                                    <Typography variant="h5">
                                        Saldo do Mês
                                    </Typography>
                                    {
                                        monthBalance && <Typography variant="body2">
                                            De {toLocaleDateString(monthBalance.periodFrom)} até {toLocaleDateString(monthBalance.periodTo)}
                                        </Typography>
                                    }
                                </div>
                                {
                                    monthBalance && <Typography className={monthBalance.value >= 0 ? classes.positiveValue : classes.negativeValue}>
                                        {toCurrency(monthBalance.value)}
                                    </Typography>
                                }
                            </div>
                            <div>
                                <IconButton disableRipple className={`${classes.cardIcon} ${classes.monthIcon}`}>
                                    <TodayIcon fontSize="large" />
                                </IconButton>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Notification state={notification} setState={setNotification} />
        </>
    );
}
