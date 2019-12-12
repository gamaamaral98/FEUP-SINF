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
  { id: 'warehouse', label: 'Warehouses', minWidth: 170 },
  { id: 'products', label: 'Products', minWidth: 100 },
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

  const [warehouses, setWarehouses] = useState(null);
  const [warehousesLoading, setWarehouseLoading] = useState(false);

  const [warehousesItems, setWarehousesItems] = useState(null);
  const [warehousesItemsLoading, setWarehousesItemsLoading] = useState(false);

  useEffect(() => {

    setWarehouseLoading(true);

    axios.get('http://localhost:3001/warehouses')
      .then((res) => {

        setWarehouseLoading(false);

        let tempWarehouses = [];
        for(let i = 0; i < res.data.length; i++){

          if(res.data[i].warehouseKey !== "A0"){

            tempWarehouses.push(res.data[i].description);
          }
        }

        setWarehouses(tempWarehouses);
      })
      .catch((_) => {
        setWarehouseLoading(false);
      })
  }, []);

  useEffect(() => {

    setWarehousesItemsLoading(true);

    axios.get('http://localhost:3001/warehouses/items')
      .then((res) => {

        setWarehousesItemsLoading(false);

        let tempWarehousesItems = [];
        for(let i = 0; i < warehouses.length; i++){

          tempWarehousesItems.push([warehouses[i], []]);
        }
        for(let i = 0; i < res.data.length; i++){
  
          let description = res.data[i].description;
  
          for(let k = 0; k < res.data[i].materialsItemWarehouses.length; k++){
  
            let stockBalance = res.data[i].materialsItemWarehouses[k].stockBalance;
            if(stockBalance !== 0){

              let warehouseDescription = res.data[i].materialsItemWarehouses[k].warehouseDescription;
              for(let j = 0; j < tempWarehousesItems.length; j++){

                if(tempWarehousesItems[j][0] === warehouseDescription){

                  tempWarehousesItems[j][1].push([description, stockBalance]);
                }
              }
            }
          }
        }

        setWarehousesItems(tempWarehousesItems);
      })
      .catch((_) => {
        setWarehousesItemsLoading(false);
      })
  }, [warehouses]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  if(warehousesLoading && setWarehousesItemsLoading) return(<CircularProgress/>)
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
            {warehousesItemsLoading ? <CircularProgress/>
              : warehousesItems && warehousesItems.map(warehouseItem => {
                return(
                  <div className={classes.root}>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>{warehouseItem[0]}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Table className={classes.table} aria-label="simple table">
                          <TableBody>
                            {warehouseItem[1].map(item => (
                              <TableRow key={item[0]}>
                                <TableCell component="th" scope="row">
                                  {item[0]}
                                </TableCell>
                                <TableCell align="right">{item[1]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                )
              })
            }
          </TableBody>
        </Table>
      </div>
      {warehousesItems === null ? <div/> :        
         <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={warehousesItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />}
    </Paper>
  );
}
