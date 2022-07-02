import { Color } from '@material-ui/lab';
import { AxiosError } from 'axios';
import { NotificationState } from '../components/Notification';
import { ApiError } from '../services/client';

export type NotifyArgs = {
    setNotification: (value: React.SetStateAction<NotificationState>) => void,
    message: string,
    details?: string,
    severity?: Color,
}

export function notify(args: NotifyArgs): void {
    const { setNotification, message, details, severity } = args;
    setNotification({
        open: true,
        message,
        details,
        severity: severity || 'success'
    });
}

export type ErrorMessage = {
    message: string,
    details?: string,
    severity: Color
}

export function buildErrorMessage(error: AxiosError<ApiError>, message: string): ErrorMessage {
    const severity = 'error';
    const details = error?.response?.data.error;

    return { message, severity, details };
}
