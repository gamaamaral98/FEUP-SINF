import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'productName', label: 'Product\u00a0Name', minWidth: 170 },
  { id: 'quantity', label: 'Quantity', minWidth: 100 },
];

function createData(productName, quantity) {
  return { productName, quantity };
}

const rows = [
  createData('Coca Cola', 2000),
  createData('Pepsi', 1000),
  createData('Fanta', 1500),
  createData('Sprite', 2000),
  createData('Mountain Dew', 1000),
  createData('7up', 1500),
  createData('Dr Pepper', 1000),
  createData('Coca Cola', 2000),
  createData('Pepsi', 2000),
  createData('Fanta', 2000),
  createData('Sprite', 2000),
  createData('Mountain Dew', 1500),
  createData('7up', 2000),
  createData('Dr Pepper', 1000),
  createData('Coca Cola', 2000),
  createData('Pepsi', 1500),
  createData('Fanta', 2000),
  createData('Sprite', 2000),
  createData('Mountain Dew', 1000),
  createData('7up', 1500),
  createData('Dr Pepper', 2000),
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}