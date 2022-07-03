import React from 'react';
import { ReactElement } from 'react';
import Page from '../../components/Page';
import Budgets from './Budgets';

export default function BudgetsPage(): ReactElement {
    return (
        <Page title={'Orçamentos'}>
            <Budgets />
        </Page>
    );
}
