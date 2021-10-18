import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useHistory } from "react-router-dom";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProgressTable({list}) {


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Atividade</StyledTableCell>
            <StyledTableCell align="right">Pontuação</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row) => (
            
              <StyledTableRow key={row.id} >
                <StyledTableCell component="th" scope="row">
                  {row.atividade}
                </StyledTableCell>
                <StyledTableCell align="right">{row.points}</StyledTableCell>
              </StyledTableRow>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}