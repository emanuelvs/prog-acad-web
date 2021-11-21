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
import { getFields } from '../../store/reducers/report';
import { GlobalStateContext } from '../../store';
import { getFormulary } from '../../store/reducers/formulary';
import { Snackbar } from '@mui/material';
import VisualizarProgresso from '../visualizarProgresso';
import FieldsTable from '../../components/FieldsTable';


const MuiAlert = React.forwardRef(function Alert(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Comission = ({list}) => {
    return (
        <>
        {
            list.map((comis, idx) => 
                <Typography 
                    variant="body2" 
                    color="textPrimary" 
                    key={idx}
                    style={{fontSize: 12, border: '1px solid #ebebeb', padding: '2px 4px', marginBottom: '6px'}}>

                    {`${comis.professorName}, ${comis.institute}, ${comis.department}`}
                </Typography>)
        }
        </>
    )
}


const RelatorioAtividades = () => {
    
    const [state, dispatch] = useContext(GlobalStateContext);
    const match = useRouteMatch();
    const params = useParams();

    useEffect(() => {

        //Chama os campos
        getFormulary(params.formularyId, dispatch).catch(console.log);
        getFields(dispatch).catch(console.log);
    }, [dispatch])

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


    let comissao = ((state.formulary.data || {}).dbFormulary || {}).comission || []

    let solicitacaoLabel = {
        'Progressao': "Progressão",
        'Promocao': "Promoção"
    }

    return (
        <Switch>
            <Route path={`${match.path}/campo/:campoId`}>
                <Activities/>
            </Route>
            <Route exact path={match.path}>
                <Container>
                    
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
                    </div>

                    <div>
                        <div style={{display:'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                            <div style={{marginRight: "12px"}}>
                                <Typography variant="body1" color="textSecondary" style={{fontSize: 12}}>
                                    Tipo de Solicitação: <span className="fnt-color-black">{solicitacaoLabel[((state.formulary.data || {}).dbFormulary || {}).type] || "N/A"}</span>
                                </Typography>
                                <Typography variant="body1" color="textSecondary" className="fnt-normal">
                                    Interstício: <span className="fnt-color-black fnt-normal">{`${new Date(((state.formulary.data || {}).dbFormulary || {}).from).toLocaleDateString()} a ${new Date(((state.formulary.data || {}).dbFormulary || {}).to).toLocaleDateString()}`}</span>
                                </Typography>
                                
                            </div>

                            <div style={{display:'flex'}}>
                                <Typography variant="body1" color="textSecondary" className="fnt-normal">
                                    Comissão:
                                </Typography>
                                <div style={{marginLeft: '8px'}}>
                                {comissao.length ? <Comission list={comissao} /> : <Typography variant="body1" color="textSecondary">&nbsp;N/A</Typography>}
                                </div>
                            </div>
                        </div>

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

            <Route path={`${match.path}/progresso`}>
                <VisualizarProgresso/>
            </Route>
        </Switch>
    );
}

export default RelatorioAtividades
