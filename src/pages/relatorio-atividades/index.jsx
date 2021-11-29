import React, { useContext, useEffect } from 'react';
import { 
    Button,
    Container, 
    IconButton, 
    Typography,
} from '@material-ui/core'
import { ArrowBack } from "@material-ui/icons";
import { Link, Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import Activities from '../activities';
import { getFields, getActivitiesCompleted } from '../../store/reducers/report';
import { GlobalStateContext } from '../../store';
import { getFormulary } from '../../store/reducers/formulary';
import { Snackbar } from '@mui/material';
import VisualizarProgresso from '../visualizarProgresso';
import FieldsTable from '../../components/FieldsTable';
import GerarRelatorio from '../gerarRelatorio';
import ReportHeader from '../../components/ReportHeader';

const MuiAlert = React.forwardRef(function Alert(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});


const RelatorioAtividades = () => {
    
    const [state, dispatch] = useContext(GlobalStateContext);
    const match = useRouteMatch();
    const params = useParams();

    useEffect(() => {
        async function fetchData() {
            let formulary = await getFormulary(params.formularyId, dispatch).catch(console.log);
            await getFields(dispatch);

            let answers = (formulary || {}).dbFormularyAnswers || [];
            await getActivitiesCompleted(answers, dispatch)
        }

        fetchData();
    }, [])

    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    const performedNumber = (fieldId) => {
        let { dbFormularyAnswers = [] } = state.formulary.data || {};

        return dbFormularyAnswers.reduce((count, newV) => {

            if(newV.fieldId === fieldId) count += 1;

            return count;
        }, 0)
    }

    return (
        <Switch>
            <Route path={`${match.path}/campo/:campoId`}>
                <Activities/>
            </Route>
            <Route exact path={match.path}>
                <Container>
                    
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
                        <div>
                            <Link to="/">
                                <IconButton edge="start" aria-label="voltar">
                                    <ArrowBack/>
                                </IconButton>
                            </Link>
                            <Typography variant="button">
                                Lista de Solicitações
                            </Typography>

                        </div>
                        <div>
                            <Typography variant="subtitle1" >
                                Relatório de Atividades
                            </Typography>

                        </div>
                        <div>
                            <Link to={`${match.url}/progresso`}>
                                <Button variant="contained" color="primary" >Visualizar Progresso</Button>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <ReportHeader/>
                        <FieldsTable list={(state.report.fields || [])} performedNumber={performedNumber}/>
                        
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '24px'}}>
                        <Link to={`${match.url}/progresso`}>
                            <Button variant="contained" color="primary" >Visualizar Progresso</Button>
                        </Link>
                    </div>
                    
                    <Snackbar open={open} autoHideDuration={3500} onClose={handleClose} >
                        <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            Relatório criado com sucesso!
                        </MuiAlert>
                    </Snackbar>
                </Container>
            </Route>

            <Route exact path={`${match.path}/progresso`}>
                <VisualizarProgresso/>
            </Route>
            
        </Switch>
    );
}

export default RelatorioAtividades
