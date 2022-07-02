export function toCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

export function toLocaleDateString(date: string): string {
    return toLocaleDate(date).toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function toLocaleDate(date: string): Date {
    return new Date(date + ' 00:00:00 -03:00');
}

export function toLocaleDateTimeString(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
}
