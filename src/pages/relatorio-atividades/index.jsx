import React from 'react';
import { 
    Container, 
    IconButton, 
    Typography,
} from '@material-ui/core'
import { ArrowBack } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import PaperContainer from '../../components/PaperContainer';
import AreaItem from '../../components/AreaItem';

const RelatorioAtividades = () => {

    return (
        <Container>

            <div style={{display: 'flex', alignItems: 'center'}}>
                <Link to="/">
                    <IconButton edge="start" aria-label="voltar">
                        <ArrowBack/>
                    </IconButton>
                </Link>
                <Typography variant="h6">
                    Relatório de Atividades
                </Typography>
            </div>

            <PaperContainer>
                { [1,2,3].map(el => <AreaItem/>) }
            </PaperContainer>
        </Container>
    );
}

export default RelatorioAtividades
