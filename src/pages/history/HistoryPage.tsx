import React, { ReactElement } from 'react';
import Page from '../../components/Page';
import History from './History';

export default function HistoryPage(): ReactElement {

    return (
        <Page title={'Histórico'}>
            <History />
        </Page>
    );
}
