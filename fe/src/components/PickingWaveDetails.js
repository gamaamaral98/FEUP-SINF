import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import { CircularProgress, Button, TextField } from "@material-ui/core";

const columns = [
    { id: 'products', label: 'Products', minWidth: 100, align: 'left' },
    { id: 'warehouse', label: 'Warehouse', minWidth: 100, align: 'center' },
    { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'center' },
    { id: 'pickedQuantity', label: 'Picked\u00a0Quantity', minWidth: 100, align: 'center' },
];


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

    const handleFinishPicking = event => {
        event.preventDefault();
    };

    if (pickingWaveLoading) return <CircularProgress />;
    if (!pickingWave) return <Redirect to="/404" />;
    return (
        <React.Fragment>
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
                <TableBody style={{backgroundColor:"white"}}>
                    {pickingWave.products.map(product => {
                        return(
                            <TableRow key={product.description}>    
                                <TableCell component="th" scope="row">
                                    {product.description}
                                </TableCell>
                                <TableCell align="center">
                                    {product.warehouse}
                                </TableCell>
                                <TableCell align="center">
                                    Quantity: {product.quantity}
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        label="Enter Quantity Picked"
                                        name="quantity"
                                        type="text"
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <form onSubmit={e => handleFinishPicking(e)}>
                <Button type="submit" style={{ marginTop: "18px" }}>
                    Finished picking
                </Button>
            </form>
        </React.Fragment>
    );
};

export default PickingWaveDetails;
