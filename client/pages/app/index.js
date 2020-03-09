import React, { useContext, useState } from 'react';
import UserContext from '../../components/UserContext'
import Dashboard from "../../components/app"
import retranscription from '../control/traitement'
import Layout from '../../components/layout';
import arrayMove from 'array-move';



const app = () => {

    return (
        <>
            <Layout>
                <Dashboard />
            </Layout>
        </>
    );
}


export default app;
