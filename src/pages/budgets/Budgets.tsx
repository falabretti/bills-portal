import { makeStyles, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import ConfirmDialog, { ConfirmDialogState } from '../../components/ConfirmDialog';
import Notification, { NotificationState } from '../../components/Notification';
import PopUp from '../../components/PopUp';
import TemporarySidebar from '../../components/TemporarySidebar';
import { UserContext, UserContextType } from '../../contexts/UserContext';

import useTable from '../../hooks/useTable';
import { ApiError, Budget, Category, createBudget, deleteBudget, getBudgets, getCategories, updateBudget } from '../../services/client';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import { toCurrency, toLocaleMonthYearString } from '../../utils/formatUtils';
import { savePdf } from '../../utils/pdfGenerator';
import BudgetsFilterForm, { BudgetsFilterFields } from './BudgetsFilterForm';
import BudgetsForm, { BudgetFields } from './BudgetsForm';

const useStyles = makeStyles(() => ({
    positiveValue: {
        color: '#179428',
        fontWeight: 500
    },
    negativeValue: {
        color: '#CE6060',
        fontWeight: 500
    },
    bold: {
        fontWeight: 500
    },
    displayNone: {
        display: 'none'
    }
}));

const headCells = [
    {
        id: 'categoryId',
        text: 'Categoria'
    },
    {
        id: 'type',
        text: 'Tipo'
    },
    {
        id: 'month',
        text: 'Mês'
    },
    {
        id: 'value',
        text: 'Valor Planejado'
    },
    {
        id: 'usage',
        text: 'Valor Atual'
    },
    {
        id: 'remaining',
        text: 'Restante'
    }
]

export default function Budgets(): ReactElement {

    const classes = useStyles();

    const { user } = useContext(UserContext) as UserContextType;
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Record<number, Category>>({});
    const [formOpen, setFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<Budget | undefined>(undefined);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false, title: '', onConfirm: () => null });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<BudgetsFilterFields>();

    const { TableContainer, TableBody, TableHead } = useTable({
        records: budgets,
        headCells,
        title: 'Seus Orçamentos',
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

    function handleSaveFilters(filters: BudgetsFilterFields) {
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

    function handleEdit(budget: Budget): void {
        setEditRecord(budget);
        setFormOpen(true);
    }

    function handleDelete(budget: Budget): void {
        showDialog('Você tem certeza que deseja excluir esse orçamento?', 'Esta operação não poderá ser desfeita.', () => {
            if (!user) {
                return;
            }

            setConfirmDialog({ ...confirmDialog, open: false });

            deleteBudget(user.id, budget.id)
                .then(() => {
                    loadBudgets();
                    notify({ setNotification, message: 'Orçamento removido com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao remover orçamento!') });
                    console.error(error);
                });
        });
    }

    function handleSubmit(values: BudgetFields, budgetId?: number) {
        if (!user) {
            return;
        }

        if (budgetId) {
            updateBudget(user.id, budgetId, values)
                .then(() => {
                    loadBudgets();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Orçamento atualizado com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao atualizar orçamento!') });
                    console.error(error);
                });
        } else {
            createBudget(user.id, values)
                .then(() => {
                    loadBudgets();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Orçamento adicionado com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao adicionar orçamento!') });
                    console.error(error);
                });
        }
    }

    function handleFormat(budget: Budget, property: string): string | ReactNode | undefined {

        if (property === 'month') {
            return toLocaleMonthYearString(budget.month);
        }

        if (property === 'type') {
            return (
                <Typography variant="body2" className={budget.type === 'INCOME' ? classes.positiveValue : classes.negativeValue}>
                    {budget.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </Typography>
            )
        }

        if (property === 'categoryId') {
            return (
                <Typography variant="body2">
                    {categories[budget.categoryId]?.name}
                </Typography>
            );
        }

        if (property === 'value') {
            return (
                <Typography variant="body2">
                    {toCurrency(budget.value)}
                </Typography>
            );
        }

        if (property === 'usage') {
            return (
                <Typography variant="body2">
                    {toCurrency(budget.usage)}
                </Typography>
            );
        }

        if (property === 'remaining') {
            const difference = budget.value - budget.usage
            return (
                <Typography variant="body2" className={classes.bold}>
                    {toCurrency(difference)}
                </Typography>
            );
        }
    }

    function loadBudgets() {
        user && getBudgets(user.id, filters)
            .then(res => {
                setBudgets(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar orçamentos!') });
                console.error(error);
            })
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

    function handleExport() {
        const headerKeys = headCells.map(cell => cell.text);
        const pdfBudgets = budgets.map(budget => ([
            categories[budget.categoryId]?.name,
            budget.type === 'INCOME' ? 'Receita' : 'Despesa',
            toLocaleMonthYearString(budget.month),
            toCurrency(budget.value),
            toCurrency(budget.usage),
            toCurrency(budget.value - budget.usage)
        ]));
        savePdf('Seus Orçamentos', headerKeys, pdfBudgets);
    }   

    useEffect(() => {
        loadBudgets();
        loadCategories();
    }, [])

    useEffect(() => {
        loadBudgets();
    }, [filters])

    return (
        <>
            <TableContainer>
                <TableHead />
                <TableBody />
            </TableContainer>
            <PopUp title={editRecord ? "Atualizar Orçamento" : "Adicionar Orçamento"} maxWidth="md" open={formOpen}  onClose={() => { setFormOpen(false); }}>
                <BudgetsForm onSubmit={handleSubmit} editRecord={editRecord}  />
            </PopUp>
            <Notification state={notification} setState={setNotification} />
            <ConfirmDialog state={confirmDialog} setState={setConfirmDialog} />
            <TemporarySidebar open={filterOpen} onClose={() => setFilterOpen(false)}>
                <BudgetsFilterForm onSubmit={handleSaveFilters} categories={Object.values(categories)} />
            </TemporarySidebar>
        </>
    );
}
