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
  { id: 'purchaseOrder', label: 'Purchase\u00a0Order', minWidth: 170 },
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

  const [purchases, setPurchases] = useState(null);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [totalPurchases, setTotalPurchases] = useState(0);


  useEffect(() => {

    setPurchasesLoading(true);

    axios.get(`http://localhost:3001/purchases/page=${page+1}&pageSize=${rowsPerPage}`)
      .then((res) => {

        setTotalPurchases(res.data.recordCount);
        setPurchasesLoading(false);

        let purchaseOrders = [];
        for(let i = 0; i < res.data.data.length; i++){
            purchaseOrders.push(res.data.data[i]);
        }

        setPurchases(purchaseOrders);
      })
      .catch((_) => {
        setPurchasesLoading(false);
      })
  }, [page, rowsPerPage]);


  function handleGenerateGoodsReceipt(event, naturalKey, item){
    event.preventDefault();
    const quantity = parseInt(event.target.quantity.value);

    axios.post(`http://localhost:3001/purchases/entry/page=${page+1}&pageSize=${rowsPerPage}`, [{SourceDocKey: naturalKey, SourceDocLineNumber: item, quantity: quantity}])
      .then((res) => {
        if(res.status === 200){
          let purchaseOrders = [];
          for(let i = 0; i < res.data.data.length; i++){
              purchaseOrders.push(res.data.data[i]);
          }
          setTotalPurchases(res.data.recordCount);
          setPurchases(purchaseOrders);
        }
      })
  };
  

  function CheckQuantity(props) {
    const quantity = props.quantity;
    const received = props.received;
    const description = props.description;
    const naturalKey = props.naturalKey;
    const item = props.itemNumber;

    if (quantity !== received) {
      return <TableRow key={description}>
        <TableCell component="th" scope="row"> {description} </TableCell>
        <TableCell align="center">Received: {received} of {quantity}</TableCell>
        <TableCell align="right"> 
          <form onSubmit={(e) => handleGenerateGoodsReceipt(e, naturalKey, item)}>
            <label htmlFor="quantity">Enter quantity: </label>
            <input name="quantity" type="text" />
            <button>Generate Goods Receipt</button>
          </form>
        </TableCell>
      </TableRow>
    }
    return <TableRow key={description}>
      <TableCell component="th" scope="row"> {description} </TableCell>
      <TableCell align="right">Received: {received} of {quantity}</TableCell>
    </TableRow>;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if(purchases === null) return(<CircularProgress/>)
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
              {purchases.map((purchase) => {
                return (
                  <div className={classes.root}>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>{purchase['naturalKey']}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Table className={classes.table} aria-label="simple table">

                          {purchase['documentLines'].map((item) =>(
                          <TableBody>
                            <CheckQuantity itemNumber={item['index']} description={item['description']} quantity={item['quantity']} received={item['receivedQuantity']} naturalKey={purchase['naturalKey']}/>
                          </TableBody>
                          ))}
                        </Table>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                );
              })}
            </TableBody>
          </Table>
        </div>      
         <TablePagination
          rowsPerPageOptions={[1, 10, 25, 100]}
          component="div"
          count={totalPurchases}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
}
