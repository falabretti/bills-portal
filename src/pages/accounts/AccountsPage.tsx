import React from 'react';
import { ReactElement } from 'react';
import Page from '../../components/Page';
import Accounts from './Accounts';

export default function AccountsPage(): ReactElement {
    return (
        <Page title={'Contas'}>
            <Accounts />
        </Page>
    );
}
