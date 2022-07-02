import { AxiosError } from 'axios';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { useContext } from 'react';
import Notification, { NotificationState } from '../../components/Notification';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import useTable from '../../hooks/useTable';
import { ApiError, getLogs, Log } from '../../services/client';
import { buildErrorMessage, notify } from '../../utils/componentUtils';
import { toLocaleDateTimeString } from '../../utils/formatUtils';

const headCells = [
    {
        id: 'date',
        text: 'Data'
    },
    {
        id: 'message',
        text: 'Mensagem'
    }
]

export default function History(): ReactElement {

    const { user } = useContext(UserContext) as UserContextType;
    const [logs, setLogs] = useState<Log[]>([]);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: '', severity: 'success' });

    const { TableContainer, TableHead, TableBody } = useTable({
        records: logs,
        headCells,
        title: ' Histórico de operações',
        onFormat: handleFormat
    });

    function handleFormat(log: Log, property: string): string | ReactNode | undefined {

        if (property === 'date') {
            return toLocaleDateTimeString(log.date);
        }
    }

    function loadLogs() {
        user && getLogs(user.id)
            .then(res => {
                setLogs(res.data);
            }).catch((error: AxiosError<ApiError>) => {
                notify({ setNotification, ...buildErrorMessage(error, 'Erro ao carregar histórico!') });
                console.error(error);
            });
    }

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <>
            <TableContainer>
                <TableHead />
                <TableBody />
            </TableContainer>
            <Notification state={notification} setState={setNotification} />
        </>
    );
}
