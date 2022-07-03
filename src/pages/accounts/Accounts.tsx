import { makeStyles, Typography } from '@material-ui/core';
import React, { ReactElement, ReactNode, useState } from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import useTable from '../../hooks/useTable';
import { Account, ApiError, createAccount, deleteAccount, getAccounts, updateAccount } from '../../services/client';
import AccountsForm, { AccountFields } from './AccountsForm';
import PopUp from '../../components/PopUp';
import Notification, { NotificationState } from '../../components/Notification';
import ConfirmDialog, { ConfirmDialogState } from '../../components/ConfirmDialog';
import { toCurrency } from '../../utils/formatUtils';
import { AxiosError } from 'axios';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import TemporarySidebar from '../../components/TemporarySidebar';
import AccountFilterForm, { AccountFilterFields } from './AccountFilterForm';
import { savePdf } from '../../utils/pdfGenerator';

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
        id: 'name',
        text: 'Nome'
    },
    {
        id: 'balance',
        text: 'Saldo'
    }
]

export default function Accounts(): ReactElement {

    const classes = useStyles();
    const { user } = useContext(UserContext) as UserContextType;

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<Account | undefined>(undefined);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false, title: '', onConfirm: () => null });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<AccountFilterFields>();

    const { TableContainer, TableHead, TableBody } = useTable({
        records: accounts,
        headCells,
        title: 'Suas Contas',
        onAdd: handleAdd,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onFormat: handleFormat,
        onFilter: handleFilter,
        onExport: handleExport
    });

    function handleFilter() {
        setFilterOpen(true);
    }

    function handleSaveFilters(filters: AccountFilterFields) {
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

    function handleEdit(account: Account): void {
        setEditRecord(account);
        setFormOpen(true);
    }

    function handleDelete(account: Account): void {
        showDialog('Você tem certeza que deseja excluir essa conta?', 'Todas as transações dessa conta também serão excluídas.', () => {
            if (!user) {
                return;
            }

            setConfirmDialog({ ...confirmDialog, open: false });

            deleteAccount(user.id, account.id)
                .then(() => {
                    loadAccounts();
                    notify({ setNotification, message: 'Conta removida com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao remover conta!') });
                    console.error(error);
                });
        });
    }

    function handleSubmit(values: AccountFields, accountId?: number) {
        if (!user) {
            return;
        }

        if (accountId) {
            updateAccount(user.id, accountId, values)
                .then(() => {
                    loadAccounts();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Conta atualizada com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao atualizar conta!') });
                    console.error(error);
                });
        } else {
            createAccount(user.id, values)
                .then(() => {
                    loadAccounts();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Conta adicionada com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao adicionar conta!') });
                    console.error(error);
                });
        }
    }

    function handleFormat(account: Account, property: string): string | ReactNode | undefined {

        if (property === 'balance') {
            return (
                <Typography variant="body2" className={account.balance < 0 ? classes.negativeValue : classes.positiveValue}>
                    {toCurrency(account.balance)}
                </Typography>
            )
        }
    }

    function loadAccounts() {
        user && getAccounts(user.id, filters)
            .then(res => {
                setAccounts(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar contas!') });
                console.error(error);
            });
    }

    function handleExport() {
        const headerKeys = headCells.map(cell => cell.text);
        const pdfAccounts = accounts.map(acc => ([acc.name, toCurrency(acc.balance)]));
        savePdf('Suas Contas', headerKeys, pdfAccounts);
    }

    useEffect(() => {
        loadAccounts();
    }, []);

    useEffect(() => {
        loadAccounts();
    }, [filters]);

    return (
        <>
            <TableContainer>
                <TableHead />
                <TableBody />
            </TableContainer>
            <PopUp title={editRecord ? 'Editar Conta' : 'Adicionar Conta'} open={formOpen} onClose={() => setFormOpen(false)}>
                <AccountsForm onSubmit={handleSubmit} editRecord={editRecord} />
            </PopUp>
            <Notification state={notification} setState={setNotification} />
            <ConfirmDialog state={confirmDialog} setState={setConfirmDialog} />
            <TemporarySidebar open={filterOpen} onClose={() => setFilterOpen(false)} >
                <AccountFilterForm onSubmit={handleSaveFilters} />
            </TemporarySidebar>
        </>
    );
}
