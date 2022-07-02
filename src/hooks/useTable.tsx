import React, { ReactElement, ReactNode } from 'react';
import { Button, IconButton, makeStyles, Paper, Table, TableCell, TableContainer as MuiTableContainer, TableHead as MuiTableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import { TableBody as MuiTableBody } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';

type TableContainerProps = {
    children: ReactNode
}

type HeadCell = {
    id: string,
    text: string
}

type UseTableType = {
    TableContainer: (props: TableContainerProps) => ReactElement,
    TableHead: () => ReactElement,
    TableBody: () => ReactElement
}

type OnAddFunction = () => void
type OnEditFunction<Type> = (item: Type) => void
type OnDeleteFunction<Type> = (item: Type) => void
type OnFormatFunction<Type> = (item: Type, propery: string) => string | ReactNode | undefined

type UseTableArgs<Type> = {
    records: Type[],
    headCells: HeadCell[],
    title: string,
    onAdd?: OnAddFunction,
    onEdit?: OnEditFunction<Type>,
    onDelete?: OnDeleteFunction<Type>,
    onFormat?: OnFormatFunction<Type>,
    onFilter?: () => void
}

const useStyles = makeStyles({
    actionsColumn: {
        width: '20%'
    },
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    tableFooter: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    tableContainer: {
        maxHeight: '80vh'
    }
});

export default function useTable<Type extends Record<string, string | number>>(args: UseTableArgs<Type>): UseTableType {

    const { records, headCells, title, onAdd, onEdit, onDelete, onFormat, onFilter } = args;

    const classes = useStyles();
    const withActions = Boolean(onEdit || onDelete);

    const TableContainer = (props: TableContainerProps): ReactElement => {
        return (
            <MuiTableContainer component={Paper} className={classes.tableContainer}>

                <Toolbar className={classes.tableHeader}>
                    <Typography variant="h5">{title}</Typography>
                    {
                        onFilter && <Button variant="outlined" color="primary" startIcon={<FilterListIcon />} onClick={onFilter}>Filtrar</Button>
                    }
                </Toolbar>

                <Table size="small" stickyHeader >
                    {props.children}
                </Table>
                {
                    onAdd && <Toolbar className={classes.tableFooter}>
                        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={onAdd}>Adicionar</Button>
                    </Toolbar>
                }
            </MuiTableContainer>
        );
    }

    const TableHead = (): ReactElement => {
        return (
            <MuiTableHead>
                <TableRow>
                    {
                        headCells.map(headCell => (
                            <TableCell key={headCell.id}>{headCell.text}</TableCell>
                        ))
                    }
                    {
                        withActions &&
                        <TableCell className={classes.actionsColumn}>Ações</TableCell>
                    }
                </TableRow>
            </MuiTableHead>
        );
    }

    const TableBody = (): ReactElement => {
        return (
            <MuiTableBody>
                {
                    records.map((record, index) => (
                        <TableRow key={index}>
                            {
                                headCells.map(headCell => (
                                    <TableCell key={headCell.id}>
                                        {onFormat && onFormat(record, headCell.id) || record[headCell.id]}
                                    </TableCell>
                                ))
                            }
                            {
                                withActions &&
                                <TableCell>
                                    {
                                        onEdit &&
                                        <IconButton color="primary" size="small" onClick={() => onEdit(record)}>
                                            <EditIcon />
                                        </IconButton>
                                    }
                                    {
                                        onDelete &&
                                        <IconButton color="secondary" size="small" onClick={() => onDelete(record)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                </TableCell>
                            }
                        </TableRow>
                    ))
                }
            </MuiTableBody>
        );
    }

    return {
        TableContainer,
        TableHead,
        TableBody
    }
}
