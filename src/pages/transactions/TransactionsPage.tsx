import React, { ReactElement } from 'react';
import Page from '../../components/Page';
import Transactions from './Transactions';

export default function TransactionsPage(): ReactElement {
    return (
        <Page title={'Transações'}>
            <Transactions />
        </Page>
    );
}
