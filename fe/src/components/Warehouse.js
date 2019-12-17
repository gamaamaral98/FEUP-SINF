import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { CircularProgress, Button, TextField } from '@material-ui/core';

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

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

export default function StickyHeadTable() {

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [warehouses, setWarehouses] = useState(null);
  /*eslint-disable no-unused-vars*/
  const [warehousesLoading, setWarehouseLoading] = useState(false);
  /*eslint-disable no-unused-vars*/

  const [warehousesItems, setWarehousesItems] = useState(null);
  /*eslint-disable no-unused-vars*/
  const [warehousesItemsLoading, setWarehousesItemsLoading] = useState(false);
  /*eslint-disable no-unused-vars*/

  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState(undefined);

  useEffect(() => {

    setWarehouseLoading(true);

    axios.get('http://localhost:3001/warehouses')
      .then((res) => {

        setWarehouseLoading(false);
        setWarehouses(res.data.data);
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
        let tempWarehousesItems = handleWarehousesItems(res.data.data);
        setWarehousesItems(tempWarehousesItems);
      })
      .catch((_) => {
        setWarehousesItemsLoading(false);
      })
  }, [warehouses]);

  function handleWarehousesItems(newWarehousesItems){

    let tempWarehousesItems = [];
    for(let i = 0; i < warehouses.length; i++){

      tempWarehousesItems.push([warehouses[i], []]);
    }
    for(let i = 0; i < newWarehousesItems.length; i++){
      for(let k = 0; k < tempWarehousesItems.length; k++){
        if(tempWarehousesItems[k][0] === newWarehousesItems[i][4]){

          let itemID = newWarehousesItems[i][0];
          let description = newWarehousesItems[i][1];
          let targetWarehouse = newWarehousesItems[i][2];
          let stockBalance = newWarehousesItems[i][3];
          tempWarehousesItems[k][1].push([itemID, description, stockBalance, targetWarehouse]);
        }
      }
    }
    for(let i = 0; i < tempWarehousesItems.length; i++){

      if(tempWarehousesItems[i][1].length === 0 && tempWarehousesItems[i][0] !== "Entry" && tempWarehousesItems[i][0] !== "Exit"){
        tempWarehousesItems.splice(i, 1);
        i--;
      }
    }
    return tempWarehousesItems;
  }

  function handleWarehouseTransfers(event, itemKey, targetWarehouse){
    event.preventDefault();
    const quantity = parseInt(event.target.quantity.value);

    axios.post(`http://localhost:3001/warehouses/transfer`, {company:"DUDA", sourceWarehouse:"01", targetWarehouse:targetWarehouse, UnloadingCountry:"PT", documentLines:[{materialsItem:itemKey, quantity:quantity}]})
      .then((res) => {
        if(res.status === 200){

          let tempWarehousesItems = handleWarehousesItems(res.data.data);
          setWarehousesItems(tempWarehousesItems);
          setTransition(() => TransitionRight);
          setOpen(true);
        }
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
              <TextField label="Enter Quantity" name="quantity" type="text" />
              <Button type="submit" style={{marginTop:"18px"}}>Generate Warehouse Transfer</Button>
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

  const handleClose = () => {
    setOpen(false);
  };

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
      <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={transition}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">Product Warehouse Transfer successful!</span>}
      />
    </React.Fragment>
  );
}
