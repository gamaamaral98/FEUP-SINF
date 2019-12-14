import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { CircularProgress, Button } from '@material-ui/core';

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
  button: {
    marginTop: "1em",
    float: "right",
  },
  stock: {
    "&::before": {
      content:'"Stock: "',
    }
  }
});

class Selection {
  constructor(product, quantity, sale) {
    this.product = product;
    this.quantity = quantity;
    this.sale = sale;
  }
  
  equals(other) {
    return other.product === this.product 
    && other.quantity === this.quantity
    && other.sale === this.sale;
  };
}

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [sales, setsales] = useState([]);
  const [salesLoading, setsalesLoading] = useState(true);
  const [items, setItems] = useState({});
  const [itemsLoading, setItemsLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [totalSelected, setTotalSelected] = useState(0);
  const [selected] = useState([]);


  useEffect(() => {

    setsalesLoading(true);

    axios.get(`http://localhost:3001/sales/page=${page+1}&pageSize=${rowsPerPage}`)
      .then((res) => {
        setTotalSales(res.data.recordCount);

        setsalesLoading(false);

        let salesOrders = [];
        for(let i = 0; i < res.data.data.length; i++){
          salesOrders.push(res.data.data[i]);
        }

        setsales(salesOrders);

      })
      .catch((_) => {
        setsalesLoading(false);
      })
  }, [page, rowsPerPage]);

  useEffect(() => {
    setItemsLoading(true)

    let promises = [];
    for(let sale in sales) {
      const dl = sales[sale].documentLines;
      for(let item in dl) {
        item = dl[item];
        let key = item.salesItem;
        if(!(key in items)) {
          promises.push(axios.get(`http://localhost:3001/item/${key}`))
        }
      }
    }
    Promise.all(promises).then(values => {
      let temp = {...items};
      for(let res in values) {
        const data = values[res].data
        temp[data.itemKey] = data;
      }
      setItems(temp);
      setItemsLoading(false)
    })
  }, [sales]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggle = (key, quantity, sale) => event => {
    const s = new Selection(key, quantity, sale);
    for(let i = 0; i < selected.length; i++) {
      if(selected[i].equals(s)) {
        selected.splice(i, 1);
        setTotalSelected(totalSelected-1);
        return;
      }
    }
    selected.push(s);
    setTotalSelected(totalSelected+1);
    console.log(items)
  }

  if(salesLoading) return(<CircularProgress/>)
  else
    return (
      <React.Fragment>
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
              {sales.map(sale => {
                 return (
                  <ExpansionPanel className={classes.root}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>{sale['naturalKey']}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Table className={classes.table} aria-label="simple table">
                        <TableBody>
                          {sale['documentLines'].map(item => {
                            return (
                            <TableRow key={item.salesItem}>
                              <TableCell component="th" scope="row" key={item.salesItem}>
                              <FormControlLabel
                                aria-label="Acknowledge"
                                onClick={event => event.stopPropagation()}
                                onFocus={event => event.stopPropagation()}
                                control={<Checkbox color="primary"/>}
                                onChange={handleToggle(item.salesItem, item.quantity, sale.id)}
                                label={item.description}
                                checked = {selected.some(e => e.equals(new Selection(item.salesItem, item.quantity, sale.id)))}
                                disabled={!(items[item.salesItem] && (items[item.salesItem]
                                  .materialsItemWarehouses)
                                  .find(({warehouseDescription}) => warehouseDescription != "Entry" && warehouseDescription != "Exit")
                                  .stockBalance >= item.quantity)}
                              />
                              </TableCell>
                              <TableCell align="right">
                                Quantity {item.quantity} <br></br>
                                {itemsLoading ?
                                  <></> : items[item.salesItem] &&
                                  <Typography variant="caption" className={classes.stock}>
                                    {(items[item.salesItem]
                                    .materialsItemWarehouses)
                                    .find(({warehouseDescription}) => warehouseDescription != "Entry" && warehouseDescription != "Exit")
                                    .stockBalance}
                                  </Typography>}
                              </TableCell>
                            </TableRow>
                          )})}
                        </TableBody>
                      </Table>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                );
              })}
            </TableBody>
          </Table>
        </div>       
         <TablePagination
          rowsPerPageOptions={[1, 10, 25, 100]}
          component="div"
          count={totalSales}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Typography variant="overline" display="block" gutterBottom>
        {totalSelected} items selected
      </Typography>
      <Button 
      className={classes.button}
      variant="contained"
      color="primary"
      disabled={totalSelected < 1}>
        Create picking wave
      </Button>
      </React.Fragment>
    );
}