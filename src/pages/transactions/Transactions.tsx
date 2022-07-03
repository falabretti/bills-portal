import { makeStyles, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import ConfirmDialog, { ConfirmDialogState } from '../../components/ConfirmDialog';
import Notification, { NotificationState } from '../../components/Notification';
import PopUp from '../../components/PopUp';
import TemporarySidebar from '../../components/TemporarySidebar';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import useTable from '../../hooks/useTable';
import { Account, ApiError, Category, createTransaction, deleteTransaction, getAccounts, getCategories, getTransactions, Transaction, updateTransaction } from '../../services/client';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import { toCurrency, toLocaleDateString } from '../../utils/formatUtils';
import TransactionFilterForm, { TransactionFilterFields } from './TransactionFilterForm';
import TransactionsForm, { TransactionFields } from './TransactionsForm';

const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: theme.spacing(2)
    },
    positiveValue: {
        color: '#179428',
        fontWeight: 500
    },
    negativeValue: {
        color: '#CE6060',
        fontWeight: 500
    }
}));

const headCells = [
    {
        id: 'transactionDate',
        text: 'Data'
    },
    {
        id: 'description',
        text: 'Descrição'
    },
    {
        id: 'type',
        text: 'Tipo'
    },
    {
        id: 'categoryId',
        text: 'Categoria'
    },
    {
        id: 'accountId',
        text: 'Conta'
    },
    {
        id: 'value',
        text: 'Valor'
    }
]

export default function Transactions(): ReactElement {

    const classes = useStyles();

    const { user } = useContext(UserContext) as UserContextType;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Record<number, Category>>({});
    const [accounts, setAccounts] = useState<Record<number, Account>>({});
    const [formOpen, setFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<Transaction | undefined>(undefined);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false, title: '', onConfirm: () => null });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<TransactionFilterFields>();

    const { TableContainer, TableHead, TableBody } = useTable({
        records: transactions,
        headCells,
        title: 'Suas Transações',
        onAdd: handleAdd,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onFormat: handleFormat,
        onFilter: handleFilter
    });

    function handleFilter() {
        setFilterOpen(true);
    }

    function handleSaveFilters(filters: TransactionFilterFields) {
        setFilters(filters);
        setFilterOpen(false);
    }

    function showDialog(title: string, subtitle: string, onConfirm: () => void) {
        setConfirmDialog({
            open: true,
            title,
            subtitle,
            onConfirm
        });
    }

    function handleAdd(): void {
        setEditRecord(undefined);
        setFormOpen(true);
    }

    function handleEdit(transaction: Transaction): void {
        setEditRecord(transaction);
        setFormOpen(true);
    }

    function handleDelete(transaction: Transaction): void {
        showDialog('Você tem certeza que deseja excluir essa transação?', 'Esta operação não poderá ser desfeita.', () => {
            if (!user) {
                return;
            }

            setConfirmDialog({ ...confirmDialog, open: false });

            deleteTransaction(user.id, transaction.id)
                .then(() => {
                    loadTransactions();
                    notify({ setNotification, message: 'Transação removida com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao remover transação!') });
                    console.error(error);
                });
        });
    }

    function handleSubmit(values: TransactionFields, transactionId?: number) {
        if (!user) {
            return;
        }

        if (transactionId) {
            updateTransaction(user.id, transactionId, values)
                .then(() => {
                    loadTransactions();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Transação atualizada com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao atualizar transação!') });
                    console.error(error);
                });
        } else {
            createTransaction(user.id, values)
                .then(() => {
                    loadTransactions();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Transação adicionada com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao adicionar transação!') });
                    console.error(error);
                });
        }
    }

    function handleFormat(transaction: Transaction, property: string): string | ReactNode | undefined {

        if (property === 'transactionDate') {
            return toLocaleDateString(transaction.transactionDate);
        }

        if (property === 'type') {
            const isExpense = transaction.type === 'EXPENSE';
            return (
                <Typography variant="body2" className={isExpense ? classes.negativeValue : classes.positiveValue}>
                    {isExpense ? 'Despesa' : 'Receita'}
                </Typography>
            )
        }

        if (property === 'categoryId') {
            const isExpense = transaction.type === 'EXPENSE';
            return (
                <Typography variant="body2" className={isExpense ? classes.negativeValue : classes.positiveValue}>
                    {categories[transaction.categoryId]?.name}
                </Typography>
            );
        }

        if (property === 'accountId') {
            return accounts[transaction.accountId]?.name;
        }

        if (property === 'value') {
            const isExpense = transaction.type === 'EXPENSE';
            return (
                <Typography variant="body2" className={isExpense ? classes.negativeValue : classes.positiveValue}>
                    {toCurrency(isExpense ? -transaction.value : transaction.value)}
                </Typography>
            );
        }
    }

    function loadTransactions() {
        user && getTransactions(user.id, filters)
            .then(res => {
                setTransactions(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar transações!') });
                console.error(error);
            });
    }

    function loadCategories() {
        user && getCategories(user.id)
            .then(res => {
                const categories = res.data.reduce<Record<number, Category>>((map, category) => {
                    map[category.id] = category;
                    return map;
                }, {});
                setCategories(categories);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar dados!') });
                console.error(error);
            });
    }

    function loadAccounts() {
        user && getAccounts(user.id)
            .then(res => {
                const accounts = res.data.reduce<Record<number, Account>>((map, account) => {
                    map[account.id] = account;
                    return map;
                }, {});
                setAccounts(accounts);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar dados!') });
                console.error(error);
            });
    }

    useEffect(() => {
        loadTransactions();
        loadCategories();
        loadAccounts();
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [filters]);

    return (
        <>
            <TableContainer>
                <TableHead />
                <TableBody />
            </TableContainer>
            <PopUp title={editRecord ? 'Editar Transação' : 'Adicionar Transação'} maxWidth="md" open={formOpen} onClose={() => { setFormOpen(false); setEditRecord(undefined) }}>
                <TransactionsForm onSubmit={handleSubmit} editRecord={editRecord} />
            </PopUp>
            <Notification state={notification} setState={setNotification} />
            <ConfirmDialog state={confirmDialog} setState={setConfirmDialog} />
            <TemporarySidebar open={filterOpen} onClose={() => setFilterOpen(false)} >
                <TransactionFilterForm onSubmit={handleSaveFilters} accounts={Object.values(accounts)} categories={Object.values(categories)} />
            </TemporarySidebar>
        </>
    );
}
