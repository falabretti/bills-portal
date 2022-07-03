import axios, { AxiosResponse } from 'axios';
import { User } from '../contexts/UserContext';
import { AccountFields } from '../pages/accounts/AccountsForm';
import { BudgetFields } from '../pages/budgets/BudgetsForm';
import { CategoryFields } from '../pages/categories/CategoriesForm';
import { RegisterFields } from '../pages/Register';
import { TransactionFields } from '../pages/transactions/TransactionsForm';
import { toYearMonthString } from '../utils/formatUtils';

const host = 'http://localhost:8080'

export type TransactionType = 'INCOME' | 'EXPENSE';

export type Account = {
    id: number,
    userId: number,
    name: string,
    balance: number
}

export type Category = {
    id: number,
    userId: number,
    name: string,
    type: TransactionType
}

export type Transaction = {
    id: number,
    accountId: number,
    userId: number,
    categoryId: number,
    type: TransactionType,
    description: string,
    transactionDate: string,
    value: number
}

export type Budget = {
    id: number,
    userId: number,
    categoryId: number,
    type: TransactionType,
    value: number,
    usage: number,
    month: string
}

export type Log = {
    id: number,
    userId: number,
    message: string,
    date: string
}

export type ApiError = {
    status: string,
    error: string
}

const endpoints = {
    getUser: host + '/user/search',
    createUser: host + '/user',
    getAccounts: host + '/account',
    createAccount: host + '/account',
    updateAccount: host + '/account',
    deleteAccount: host + '/account/:id',
    getCategories: host + '/category',
    createCategory: host + '/category',
    updateCategory: host + '/category',
    deleteCategory: host + '/category/:id',
    getIncomeCategories: host + '/category/income',
    getExpenseCategories: host + '/category/expense',
    getTransactions: host + '/transaction',
    createTransaction: host + '/transaction',
    updateTransaction: host + '/transaction',
    deleteTransaction: host + '/transaction/:id',
    getBudgets: host + '/budget/status',
    createBudget: host + '/budget',
    updateBudget: host + '/budget',
    deleteBudget: host + '/budget/:id',
    getLogs: host + '/audit'
}

export async function getUser(email: string): Promise<AxiosResponse<User>> {
    const params = { email };
    return await axios.get(endpoints.getUser, { params });
}

export async function createUser(payload: RegisterFields): Promise<AxiosResponse<User>> {
    return await axios.post(endpoints.createUser, payload);
}

export async function getAccounts(userId: number, params?: Record<string, string>): Promise<AxiosResponse<Account[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getAccounts, { headers, params });
}

export async function createAccount(userId: number, payload: AccountFields): Promise<AxiosResponse<Account>> {
    const headers = getHeaders(userId);
    return await axios.post(endpoints.createAccount, payload, { headers });
}

export async function updateAccount(userId: number, accountId: number, payload: AccountFields): Promise<AxiosResponse<Account>> {
    const headers = getHeaders(userId);
    return await axios.put(endpoints.updateAccount, { id: accountId.toFixed(), ...payload }, { headers });
}

export async function deleteAccount(userId: number, accountId: number): Promise<AxiosResponse<void>> {
    const headers = getHeaders(userId);
    const endpoint = endpoints.deleteAccount.replace(':id', accountId.toFixed());
    return await axios.delete(endpoint, { headers });
}

export async function getCategories(userId: number, params?: Record<string, string>): Promise<AxiosResponse<Category[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getCategories, { headers, params });
}

export async function getIncomeCategories(userId: number): Promise<AxiosResponse<Category[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getIncomeCategories, { headers });
}

export async function getExpenseCategories(userId: number): Promise<AxiosResponse<Category[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getExpenseCategories, { headers });
}

export async function createCategory(userId: number, payload: CategoryFields): Promise<AxiosResponse<Category>> {
    const headers = getHeaders(userId);
    return await axios.post(endpoints.createCategory, payload, { headers });
}

export async function updateCategory(userId: number, categoryId: number, payload: CategoryFields): Promise<AxiosResponse<Category>> {
    const headers = getHeaders(userId);
    return await axios.put(endpoints.updateCategory, { id: categoryId.toFixed(), ...payload }, { headers });
}

export async function deleteCategory(userId: number, categoryId: number): Promise<AxiosResponse<void>> {
    const headers = getHeaders(userId);
    const endpoint = endpoints.deleteCategory.replace(':id', categoryId.toFixed());
    return await axios.delete(endpoint, { headers });
}

export async function getTransactions(userId: number, params?: Record<string, string | number | Date | undefined | null>): Promise<AxiosResponse<Transaction[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getTransactions, { headers, params });
}

export async function createTransaction(userId: number, payload: TransactionFields): Promise<AxiosResponse<Transaction>> {
    const headers = getHeaders(userId);
    return await axios.post(endpoints.createTransaction, payload, { headers });
}

export async function updateTransaction(userId: number, transactionId: number, payload: TransactionFields): Promise<AxiosResponse<Transaction>> {
    const headers = getHeaders(userId);
    return await axios.put(endpoints.updateTransaction, { id: transactionId.toFixed(), ...payload }, { headers });
}

export async function deleteTransaction(userId: number, transactionId: number): Promise<AxiosResponse<void>> {
    const headers = getHeaders(userId);
    const endpoint = endpoints.deleteTransaction.replace(':id', transactionId.toFixed());
    return await axios.delete(endpoint, { headers });
}

export async function getBudgets(userId: number, params?: Record<string, string | number | undefined>): Promise<AxiosResponse<Budget[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getBudgets, { headers, params });
}

export async function createBudget(userId: number, payload: BudgetFields): Promise<AxiosResponse<Transaction>> {
    const headers = getHeaders(userId);
    const month = toYearMonthString(payload.month);
    return await axios.post(endpoints.createBudget, { ...payload, month }, { headers });
}

export async function updateBudget(userId: number, budgetId: number, payload: BudgetFields): Promise<AxiosResponse<Transaction>> {
    const headers = getHeaders(userId);
    const month = toYearMonthString(payload.month);
    return await axios.put(endpoints.updateBudget, { id: budgetId.toFixed(), ...payload, month }, { headers });
}

export async function deleteBudget(userId: number, budgetId: number): Promise<AxiosResponse<void>> {
    const headers = getHeaders(userId);
    const endpoint = endpoints.deleteBudget.replace(':id', budgetId.toFixed());
    return await axios.delete(endpoint, { headers });
}

export async function getLogs(userId: number): Promise<AxiosResponse<Log[]>> {
    const headers = getHeaders(userId);
    return await axios.get(endpoints.getLogs, { headers });
}

function getHeaders(userId: number) {
    return { 'user': userId };
}
