
import ButtonExport from '../components/app/buttonExport'
import ButtonImport from '../components/app/buttonImport'
import ButtonSave from '../components/app/buttonExport'
import React from 'react'
import ReactDOM from 'react-dom'

describe('Render Button', () => {
    it('Render sans crash BoutonExport', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ButtonExport/>, div);
    });

    it('Render sans crash BoutonImport', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ButtonImport/>, div);
    });

    it('Render sans crash BoutonSave', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ButtonSave/>, div);
    });

    it('Render crash', () => {
        const div = document.createElement('root');
        ReactDOM.render(<ButtonSave/>, div);
    });
})