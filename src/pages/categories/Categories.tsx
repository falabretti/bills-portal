import { makeStyles, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { ReactElement, useState } from 'react'
import { ReactNode } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import ConfirmDialog, { ConfirmDialogState } from '../../components/ConfirmDialog';
import Notification, { NotificationState } from '../../components/Notification';
import PopUp from '../../components/PopUp';
import TemporarySidebar from '../../components/TemporarySidebar';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import useTable from '../../hooks/useTable';
import { ApiError, Category, createCategory, deleteCategory, getCategories, updateCategory } from '../../services/client';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import CategoriesForm, { CategoryFields } from './CategoriesForm';
import CategoryFilterForm, { CategoryFilterFields } from './CategoryFilterForm';

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
        id: 'type',
        text: 'Tipo'
    }
]

export default function Categories(): ReactElement {

    const classes = useStyles();

    const { user } = useContext(UserContext) as UserContextType;
    const [categories, setCategories] = useState<Category[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<Category | undefined>(undefined);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false, title: '', onConfirm: () => null });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<CategoryFilterFields>();

    const { TableContainer, TableHead, TableBody } = useTable({
        records: categories,
        headCells,
        title: 'Suas Categorias',
        onAdd: handleAdd,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onFormat: handleFormat,
        onFilter: handleFilter
    });


    function handleFilter() {
        setFilterOpen(true);
    }

    function handleSaveFilters(filters: CategoryFilterFields) {
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

    function handleEdit(category: Category): void {
        setEditRecord(category);
        setFormOpen(true);
    }

    function handleDelete(category: Category): void {
        showDialog('Você tem certeza que deseja excluir essa categoria?', 'Todas as transações com essa categoria também serão excluídas.', () => {
            if (!user) {
                return;
            }

            setConfirmDialog({ ...confirmDialog, open: false });

            deleteCategory(user.id, category.id)
                .then(() => {
                    loadCategories();
                    notify({ setNotification, message: 'Categoria removida com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao remover categoria!') });
                    console.error(error);
                });
        });
    }

    function handleSubmit(values: CategoryFields, categoryId?: number) {
        if (!user) {
            return;
        }

        if (categoryId) {
            updateCategory(user.id, categoryId, values)
                .then(() => {
                    loadCategories();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Categoria atualizada com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao atualizar categoria!') });
                    console.error(error);
                });
        } else {
            createCategory(user.id, values)
                .then(() => {
                    loadCategories();
                    setFormOpen(false);
                    notify({ setNotification, message: 'Categoria adicionada com sucesso!' });
                }).catch((error: AxiosError<ApiError>) => {
                    notify({ setNotification, ...buildErrorMessage(error, 'Erro ao adicionar categoria!') });
                    console.error(error);
                });
        }
    }

    function handleFormat(category: Category, property: string): string | ReactNode | undefined {

        if (property === 'type') {
            return (
                <Typography variant="body2" className={category.type === 'INCOME' ? classes.positiveValue : classes.negativeValue}>
                    {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </Typography>
            )
        }
    }

    function loadCategories() {
        user && getCategories(user.id, filters)
            .then(res => {
                setCategories(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar categorias!') });
                console.error(error);
            });
    }

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadCategories();
    }, [filters]);

    return (
        <>
            <TableContainer>
                <TableHead />
                <TableBody />
            </TableContainer>
            <PopUp title={editRecord ? 'Editar Categoria' : 'Adicionar Categoria'} open={formOpen} onClose={() => setFormOpen(false)}>
                <CategoriesForm onSubmit={handleSubmit} editRecord={editRecord} />
            </PopUp>
            <Notification state={notification} setState={setNotification} />
            <ConfirmDialog state={confirmDialog} setState={setConfirmDialog} />
            <TemporarySidebar open={filterOpen} onClose={() => setFilterOpen(false)} >
                <CategoryFilterForm onSubmit={handleSaveFilters} />
            </TemporarySidebar>
        </>
    );
}
