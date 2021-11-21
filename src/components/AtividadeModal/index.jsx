import React, { useContext, useEffect, useState } from 'react';
import { 
    Button, 
    Container, 
    IconButton, 
    Typography, 
    Modal, 
    TextField ,
    Input
} from '@material-ui/core';
import PaperContainer from '../PaperContainer';
import { HighlightOff, CloudUpload } from "@material-ui/icons"
import { GlobalStateContext } from '../../store';
import moment from 'moment';

const headerContainer = {
    display: 'flex',
}

const AtividadeModal = ({open, handleClose, atividade, onSubmit}) => {

    const [state, ] = useContext(GlobalStateContext);

    const [semestre1, setSemestre1] = useState(0);
    const [semestre2, setSemestre2] = useState(0);
    const [semestre3, setSemestre3] = useState(0);
    const [semestre4, setSemestre4] = useState(0);
    const [arquivoPDF, setArquivoPDF] = useState({});

    let { from = '2021-10-4' } = (state.formulary.data || {}).dbFormulary || {};


    let dates = {
        p1: moment(from),
        p2: moment(from).add(6, "months"),
        p3: moment(from).add(12, "months"),
        p4: moment(from).add(18, "months"),
    }
    const intersticio = {
        period1: `${dates.p1.year()}.${dates.p1.month() < 7 ? 1 : 2}`,
        period2: `${dates.p2.year()}.${dates.p2.month() < 7 ? 1 : 2}`,
        period3: `${dates.p3.year()}.${dates.p3.month() < 7 ? 1 : 2}`,
        period4: `${dates.p4.year()}.${dates.p4.month() < 7 ? 1 : 2}`,
    }


    useEffect(() => {
        let { from = '2021-10-4', to = '2022-10-4' } = (state.formulary.data || {}).dbFormulary || {};
        let dto = ((atividade || {}).answers || {})
        
        if(dto.filename) {
            setArquivoPDF({filename: dto.filename, content: dto.content})
        }
        
        let answer = (dto || {}).answer || [];

        const inter = {
            period1: `${dates.p1.year()}.${dates.p1.month() < 7 ? 1 : 2}`,
            period2: `${dates.p2.year()}.${dates.p2.month() < 7 ? 1 : 2}`,
            period3: `${dates.p3.year()}.${dates.p3.month() < 7 ? 1 : 2}`,
            period4: `${dates.p4.year()}.${dates.p4.month() < 7 ? 1 : 2}`,
        }

        let models = [
            {period: inter.period1, cb: setSemestre1},
            {period: inter.period2, cb: setSemestre2},
            {period: inter.period3, cb: setSemestre3},
            {period: inter.period4, cb: setSemestre4},
        ]

        models.forEach(m => {
            let exist = answer.find(ans => ans.semester === m.period)
            if(exist) m.cb(exist.quantity)
        })
    }, [atividade])


    

    const getTotal = () => {
        const sum = semestre1 + semestre2 + semestre3 + semestre4;
        let dto = sum/atividade.peso;
        return (dto * atividade.pontos).toFixed(2);
    }

    const handleSemestreInput = (value, semestre) => {
        let dto = Number(value);
        if(Number.isNaN(dto) || dto < 0){
            dto = 0;
        }
        semestre(dto);
    }

    const onClose = () => {
        setSemestre1(0);
        setSemestre2(0);
        setSemestre3(0);
        setSemestre4(0);
        setArquivoPDF({})

        handleClose()
    }

    const handleFileUpload = async (event) => {
        let filename = event.target.files[0].name;
        let result = await toBase64(event.target.files[0]);
        setArquivoPDF({filename, content: result})
    }

    const toBase64 = fileObj => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = () => {
        

        let answers = (atividade || {}).answers || {}

        const formDto = {
            id: answers.id || null,
            formularyId: null,
            fieldId: null,
            activityId: atividade.id,
            file: arquivoPDF,
            answers: [
                {
                    semester: intersticio.period1,
                    quantity: semestre1
                },
                {
                    semester: intersticio.period2,
                    quantity: semestre2
                },
                {
                    semester: intersticio.period3,
                    quantity: semestre3
                },
                {
                    semester: intersticio.period4,
                    quantity: semestre4
                },
                ]
            }
        
        onSubmit(formDto).then(r => {
            onClose();
        });
    }

    return (
        <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Container>
                <div style={{marginTop: '10%'}}>
                <PaperContainer>

                    <div style={headerContainer}>
                        <div style={{flex: 1}}>
                            <Typography id="modal-modal-title" variant="h6" component="h3">
                            {atividade.atividade}
                            </Typography>
                        </div>
                        
                        <div style={{width: 'maxContent', marginLeft: 8}}>
                            <IconButton 
                                onClick={onClose}
                                aria-label="close" 
                                style={{padding: 6}} 
                                color="secondary"
                            >
                                <HighlightOff />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{marginTop: 36}}>
                        
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 2}}>
                                <Typography color="textSecondary" variant="body2">
                                    Quantidade durante o período: {intersticio.period1} a {intersticio.period4}
                                </Typography>
                                <div style={{display: 'flex', gap: 8, marginTop: 8}}>
                                    <TextField 
                                        variant="outlined" 
                                        label={intersticio.period1} 
                                        type="number" 
                                        size="small"
                                        value={semestre1}
                                        onChange={(event) => handleSemestreInput(event.target.value, setSemestre1)}/>

                                    <TextField 
                                        variant="outlined" 
                                        label={intersticio.period2} 
                                        type="number" 
                                        size="small"
                                        value={semestre2}
                                        onChange={(event) => handleSemestreInput(event.target.value, setSemestre2)}/>

                                    <TextField 
                                        variant="outlined" 
                                        label={intersticio.period3} 
                                        type="number" 
                                        size="small"
                                        value={semestre3}
                                        onChange={(event) => handleSemestreInput(event.target.value, setSemestre3)}/>

                                    <TextField 
                                        variant="outlined" 
                                        label={intersticio.period4} 
                                        type="number" 
                                        size="small"
                                        value={semestre4}
                                        onChange={(event) => handleSemestreInput(event.target.value, setSemestre4)}/>

                                </div>
                            </div>
                        
                            <div style={{flex: 1}}>
                                <div style={{margin: '0 auto', width: 'max-content'}}>
                                    <Typography color="textSecondary" variant="body2">Referência</Typography>
                                    <div style={{marginTop: 8, textAlign: 'center'}}>
                                        <small>{atividade.label}</small>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                        <div style={{marginTop: 24, display: 'flex', gap: 36}}>
                            <div>

                                <Typography color="textSecondary" variant="body2">Comprovante de atividades</Typography>
                                
                                <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                                <label 
                                    htmlFor="comprovante-atividade" 
                                    style={{
                                        borderRadius: 4, 
                                        display: 'inline-block', 
                                        textAlign: 'center',
                                    }}>
                                    <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                                    
                                    <div>
                                        <Input 
                                            
                                            accept="application/pdf,application/vnd.ms-excel" 
                                            id="comprovante-atividade" 
                                            type="file"
                                            placeholder="Anexar PDF"
                                            onChange={handleFileUpload}
                                            style={{display: 'none'}}
                                        />

                                        <Button variant="contained" component="span" size="small" color="primary">
                                            Anexar PDF
                                            <CloudUpload style={{marginLeft: "10px"}}/>
                                        </Button>
                                    </div>
                                    
                                    
                                    
                                    

                                    </div>

                                    
                                    
                                </label>

                                <div style={{marginLeft: '20px'}}>
                                    {arquivoPDF.content && <a download={arquivoPDF.filename || "comprovante.pdf"} href={arquivoPDF.content} title='Fazer download'>
                                        <Typography color="textSecondary">
                                            {arquivoPDF.filename}
                                        </Typography>
                                    </a>}
                                </div>
                                </div>

                                
                            </div>
                                    
                            <div>
                                <Typography color="textSecondary" variant="body2">Total de pontos</Typography>
                                <div style={{textAlign: 'center'}}>
                                    <Typography variant="h4" color="primary">{getTotal()}</Typography>
                                </div>
                            </div>

                        </div>

                        <div>
                            <Button variant="contained" color="primary" style={{marginLeft: 'auto', display: 'block'}} onClick={handleSubmit}>Salvar</Button>
                        </div>
                    </div>
                </PaperContainer>
                </div>
            </Container>
        </Modal>
    );
}

export default AtividadeModal;