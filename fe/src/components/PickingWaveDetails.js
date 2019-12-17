import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from "axios";
import { CircularProgress, Button, TextField } from "@material-ui/core";


const columns = [
  { id: 'pickingWave', label: 'Picking\u00a0Wave', minWidth: 170 },
];

function CheckQuantity(props) {

  // const productKey = props.productKey;
  const description = props.description;
  const pickedQuantity = props.pickedQuantity;
  const quantity = props.quantity;
  // const sale = props.sale;
  const warehouse = props.warehouse;

  return(
    <TableRow key={description}>
      <TableCell component="th" scope="row"> {description} </TableCell>
      <TableCell align="center"> {warehouse} </TableCell>
      <TableCell align="center">Quantity: {quantity}</TableCell>
      <TableCell align="right"> 
        <TextField label="Enter Quantity Picked" name="quantity" type="text" />
      </TableCell>
    </TableRow>
  );
}

function handleFinishPicking(event){
  event.preventDefault();

};

const PickingWaveDetails = props => {
  const [pickingWave, setPickingWave] = useState(null);
  const [pickingWaveLoading, setPickingWaveLoading] = useState(true);


  useEffect(() => {
    axios
      .get(`http://localhost:3001/pickingWaves/${props.id}`)
      .then(r => {
        setPickingWave({ ...r.data });
        setPickingWaveLoading(false);
      })
      .catch(() => setPickingWaveLoading(false));
  }, [props.id]);


  if (pickingWaveLoading) return <CircularProgress />;
  if (!pickingWave) return <Redirect to="/404" />;
  return(
    <React.Fragment>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
              <TableCell
                key={columns[0].id}
                align={columns[0].align}
                style={{ minWidth: columns[0].minWidth }}
              >
                PickingWave#{pickingWave['id']}
              </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pickingWave.products.map((product) => (
            <TableRow>
              <CheckQuantity productKey={product['key']} description={product['description']} pickedQuantity={product['pickedQuantity']} quantity={product['quantity']} sale={product['sale']} warehouse={product['warehouse']}/>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <form onSubmit={(e) => handleFinishPicking(e)}>
        <Button type="submit" style={{marginTop:"18px"}}>Finished picking</Button>
      </form>
    </React.Fragment>
  ); 
};

export default PickingWaveDetails;
