import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

        console.log(res);

        setWarehousesItemsLoading(false);

        let tempWarehousesItems = [];
        for(let i = 0; i < warehouses.length; i++){

          tempWarehousesItems.push([warehouses[i], []]);
        }
        for(let i = 0; i < res.data.length; i++){

          let description = res.data[i].description;
          let itemID = res.data[i].itemKey;
          let targetWarehouse = res.data[i].materialsItemWarehouses[1].warehouse;
  
          for(let k = 0; k < res.data[i].materialsItemWarehouses.length; k++){
  
            let stockBalance = res.data[i].materialsItemWarehouses[k].stockBalance;
            if(stockBalance !== 0){

              let warehouseDescription = res.data[i].materialsItemWarehouses[k].warehouseDescription;
              for(let j = 0; j < tempWarehousesItems.length; j++){

                if(tempWarehousesItems[j][0] === warehouseDescription){

                  tempWarehousesItems[j][1].push([itemID, description, stockBalance, targetWarehouse]);
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

  function handleWarehouseTransfers(event, itemKey, targetWarehouse){
    event.preventDefault();
    const quantity = parseInt(event.target.quantity.value);

    axios.post(`http://localhost:3001/warehouses/transfer`, {company:"DUDA", sourceWarehouse:"01", targetWarehouse:targetWarehouse, UnloadingCountry:"PT", documentLines:[{materialsItem:itemKey, quantity:quantity}]})
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function CheckQuantity(props) {

    const sourceWarehouse = props.warehouseSource;
    const itemKey = props.itemKey;
    const product = props.product;
    const quantity = props.quantity;
    const targetWarehouse = props.targetWarehouse;

    if(sourceWarehouse==="Entry"){
      return (
        <TableRow key={itemKey}>
          <TableCell component="th" scope="row">{product}</TableCell>
          <TableCell align="center">{quantity}</TableCell>
          <TableCell align="right"> 
            <form onSubmit={(e) => handleWarehouseTransfers(e, itemKey, targetWarehouse)}>
              <label htmlFor="quantity">Enter quantity: </label>
              <input name="quantity" type="text" />
              <button>Generate Warehouse Transfer</button>
            </form>
          </TableCell>
        </TableRow>
      );
    }
    else{
      return (
        <TableRow key={itemKey}>
          <TableCell component="th" scope="row">
            {product}
          </TableCell>
          <TableCell align="right">{quantity}</TableCell>
        </TableRow>
      );
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if(warehousesItems === null) return(<CircularProgress/>)
  else
  return (
    <React.Fragment>
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
            {warehousesItems.map(warehouseItem => {
              return(
                <ExpansionPanel square className={classes.root}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>{warehouseItem[0]}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Table className={classes.table} aria-label="simple table">
                      {warehouseItem[1].map(item => (
                        <TableBody>
                          <CheckQuantity warehouseSource={warehouseItem[0]} itemKey={item[0]} product={item[1]} quantity={item[2]} targetWarehouse={item[3]}/>
                        </TableBody>
                      ))}
                    </Table>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )
            })}
          </TableBody>
        </Table>   
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={warehousesItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
}
