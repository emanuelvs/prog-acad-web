import React, { useContext, useState } from 'react'
import { GlobalStateContext } from '../../store';
import moment from 'moment';
import './style.css';

export default function GerarRelatorio({solicitacaoId}) {

    const [state, dispatch] = useContext(GlobalStateContext);

    const [user, setUser] = useState({
		firstName: localStorage.getItem("firstName") || "User",
		lastName: localStorage.getItem("lastName") || "Name",
		siape: localStorage.getItem("siape") || "XXXXXXX"
	});
    const { type = "N/A", comission = [], from, to } = ((state.formulary.data || {}).dbFormulary || {});
    
    let dates = {
        p1: moment(from),
        p2: moment(from).add(6, "months"),
        p3: moment(from).add(12, "months"),
        p4: moment(from).add(18, "months"),
    }
    let intersticio = {
        period1: `${dates.p1.year()}.${dates.p1.month() < 7 ? 1 : 2}`,
        period2: `${dates.p2.year()}.${dates.p2.month() < 7 ? 1 : 2}`,
        period3: `${dates.p3.year()}.${dates.p3.month() < 7 ? 1 : 2}`,
        period4: `${dates.p4.year()}.${dates.p4.month() < 7 ? 1 : 2}`,
    }

    const printPage = () => {
        // var conteudo = document.getElementById('relatorio-content').innerHTML,
        // tela_impressao = window.open('about:blank');

        // tela_impressao.document.write(conteudo);
        // tela_impressao.window.print();
        // tela_impressao.window.close();
        window.print();
    }

    function getRelatorio() {
        let relatorio = [];
        const { dbFormularyAnswers = [] } = ((state.formulary.data || {}));
        let result = dbFormularyAnswers.reduce(function (r, a) {
            r[a.fieldId] = r[a.fieldId] || [];
            
            let activity = state.report.allActivities.find(acti => acti.id === a.activityId) || {};
            let atividadeDto = {...a, ...activity};

            atividadeDto.detailedAnswer = {
                period1: {
                    quantity: 0,
                    points: 0
                },
                period2: {
                    quantity: 0,
                    points: 0
                },
                period3: {
                    quantity: 0,
                    points: 0
                },
                period4: {
                    quantity: 0,
                    points: 0
                },
            };

            atividadeDto.answer.forEach(ans => {
                let dto = Number(ans.quantity/atividadeDto.peso);
				let soma = Number((dto * atividadeDto.pontos).toFixed(2));

                let ansDto = {
                    ...ans,
                    points: soma
                }
                switch (ans.semester) {
                    case intersticio.period1:
                        atividadeDto.detailedAnswer.period1 = ansDto
                        break;

                    case intersticio.period2:
                        atividadeDto.detailedAnswer.period2 = ansDto
                        break;

                    case intersticio.period3:
                        atividadeDto.detailedAnswer.period3 = ansDto
                        break;

                    case intersticio.period4:
                        atividadeDto.detailedAnswer.period4 = ansDto
                        break;

                    default:
                        break;
                }
            });

            r[a.fieldId].push(atividadeDto);
            return r;
        }, Object.create(null));
        for (const key in result) {
            if(result[key]) {
                relatorio.push({
                    campo: result[key][0].campo,
                    atividades: result[key]
                })
            }
        }
        return relatorio;
    }

    getRelatorio();

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div className="gerar-relatorio-action">
                <button className="btn-gerar-relatorio" onClick={printPage}>Imprimir Relatório</button>
            </div>


            <main id="relatorio-content">
            <table width="100%">
                <tbody>
                    <tr>
                        <td>DOCENTE: {user.firstName + " " + user.lastName}</td>
                        <td colspan="10">SIAPE: {user.siape}</td>
                    </tr>
                    <tr>
                        <td>SOLICITAÇÃO:</td>
                        <td  align="center" colspan="5">PROMOÇÃO({type === "Promocao" ? 'X':''})</td>
                        <td  align="center" colspan="5">PROGRESSÃO({type === "Progressao" ? 'X':''})</td>
                    </tr>
                    <tr>
                        <td colspan="11">COMISSÃO:</td>
                    </tr>
                    { comission.map(comis => 
                        <tr><td colspan="11">{`Prof. ${comis.professorName} - Departamento ${comis.department} - Instituto ${comis.institute}.`}</td></tr>        
                    ) }
                
                    <tr>
                        <td>DETALHE DA SOLICITAÇÃO:</td>
                        <td colspan="10" align="center">INTERSTÍCIO: {`${moment(from).format("DD/MM/yyyy")} a ${moment(to).format("DD/MM/yyyy")}`}</td>
                    </tr>

                    
                    <tr>
                        <th>CAMPO</th>
                        <th>&nbsp;</th>
                        <th colspan="4" align="center">OCORRÊNCIA</th>
                        <th>&nbsp;</th>
                        <th colspan="4" align="center">PONTUAÇÃO DETALHADA</th>
                    </tr>
                    
                    {
                        getRelatorio().map(rel => (<>
                            <tr>
                                <th>{rel.campo}</th>
                                <th>PONTOS</th>
                                <th align="center">{intersticio.period1}</th>
                                <th align="center">{intersticio.period2}</th>
                                <th align="center">{intersticio.period3}</th>
                                <th align="center">{intersticio.period4}</th>
                                <th align="center">TOTAL</th>
                                <th align="center">{intersticio.period1}</th>
                                <th align="center">{intersticio.period2}</th>
                                <th align="center">{intersticio.period3}</th>
                                <th align="center">{intersticio.period4}</th>
                            </tr>
                            { rel.atividades.map(ativ => (
                                <tr>
                                    <td>{ativ.atividade}</td>
                                    <td>{ativ.label}</td>
                                    <td align="center">{ativ.detailedAnswer.period1.quantity}</td>
                                    <td align="center">{ativ.detailedAnswer.period2.quantity}</td>
                                    <td align="center">{ativ.detailedAnswer.period3.quantity}</td>
                                    <td align="center">{ativ.detailedAnswer.period4.quantity}</td>
                                    <td align="center">{ativ.points}</td>
                                    <td align="center">{ativ.detailedAnswer.period1.points}</td>
                                    <td align="center">{ativ.detailedAnswer.period2.points}</td>
                                    <td align="center">{ativ.detailedAnswer.period3.points}</td>
                                    <td align="center">{ativ.detailedAnswer.period4.points}</td>
                                </tr>
                            )) }
                        </>)
                        )
                    }

                    
                </tbody>


                    
                
            </table>

        </main>

            
        </div>
    )
}
