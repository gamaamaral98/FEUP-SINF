import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { CircularProgress } from '@material-ui/core';

const axios = require('axios');

const columns = [
  { id: 'saleOrder', label: 'Sale\u00a0Order', minWidth: 170 },
  { id: 'sales', label: 'Sales', minWidth: 100 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});


export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [sales, setsales] = useState(null);
  const [salesLoading, setsalesLoading] = useState(false);

  useEffect(() => {

    setsalesLoading(true);

    axios.get('http://localhost:3001/sales')
      .then((res) => {

        setsalesLoading(false);

        let salesOrders = [];
        for(let i = 0; i < res.data.length; i++){
          salesOrders.push(res.data[i]);
        }

        setsales(salesOrders);
      })
      .catch((_) => {
        setsalesLoading(false);
      })
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if(salesLoading) return(<CircularProgress/>)
  else
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                  <TableCell
                    key={columns[0].id}
                    align={columns[0].align}
                    style={{ minWidth: columns[0].minWidth }}
                  >
                    {columns[0].label}
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesLoading ? <CircularProgress/>
                : sales && sales.map(sales => {
                return (
                  <div className={classes.root}>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>{sales['naturalKey']}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Table className={classes.table} aria-label="simple table">
                          <TableBody>
                            {sales['documentLines'].map(item => (
                              <TableRow key={item['description']}>
                                <TableCell component="th" scope="row">
                                  {item['description']}
                                </TableCell>
                                <TableCell align="right">{item['quantity']}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {sales === null ? <div/> :        
         <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sales.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />}
      </Paper>
    );
}
