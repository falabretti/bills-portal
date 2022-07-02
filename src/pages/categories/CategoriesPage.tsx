import React from 'react';
import { ReactElement } from 'react';
import Page from '../../components/Page';
import Categories from './Categories';

export default function CategoriesPage(): ReactElement {
    return (
        <Page title={'Categorias'}>
            <Categories />
        </Page>
    );
}
