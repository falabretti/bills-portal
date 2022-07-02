import React, { ReactElement } from 'react';
import Page from '../../components/Page';
import Home from './Home';

export default function HomePage(): ReactElement {
    return (
        <Page title={'Home'}>
            <Home />
        </Page>
    );
}
