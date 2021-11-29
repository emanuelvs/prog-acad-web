import React, { useContext, useEffect } from 'react';
import {
	Button,
	Container,
	IconButton,
	Typography,
} from '@material-ui/core'
import { ArrowBack } from "@material-ui/icons";
import { Link, Switch, Route, useRouteMatch, useParams, useHistory } from 'react-router-dom';
import PaperContainer from '../../components/PaperContainer';
import AreaItem from '../../components/AreaItem';
import Activities from '../activities';
import { getFields, getActivitiesCompleted } from '../../store/reducers/report';
import { GlobalStateContext } from '../../store';
import { createFormulary, getFormulary } from '../../store/reducers/formulary';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import ProgressTable from '../../components/ProgressTable';
import ReportHeader from '../../components/ReportHeader';


const VisualizarProgresso = () => {

	const [state, dispatch] = useContext(GlobalStateContext);
	const match = useRouteMatch();
	const params = useParams();
	const history = useHistory();
	useEffect(() => {
		let answers = (state.formulary.data || {}).dbFormularyAnswers || [];
		getActivitiesCompleted(answers, dispatch);

	}, [])


	const goBack = () => {
		history.goBack()
	}

	const goToGerarRelatorio = () => {
		history.push("relatorio")
	}

	return (
		<Container>
			{state.report.loading && <div style={{width: "100%", height: "100%", zIndex: 9999, top: 0, left: 0, position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,.3)"}}>
				<CircularProgress />
			</div>}
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<div>
						<IconButton edge="start" aria-label="voltar" onClick={goBack}>
							<ArrowBack />
						</IconButton>
					<Typography variant="button">
						Relatório de Atividades
					</Typography>

				</div>
				<div>
					<Typography variant="subtitle1" >
						Progresso
					</Typography>

				</div>
			</div>

			<div>
				<ReportHeader/>
				<div style={{maxHeight: 450}}>
					<ProgressTable list={state.report.allActivities}/>

				</div>
				
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
				<Button variant="contained" color="primary" onClick={goToGerarRelatorio}>Gerar Relatório</Button>
			</div>
		</Container>
	);
}

export default VisualizarProgresso
