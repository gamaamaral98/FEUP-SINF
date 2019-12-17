import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import {
  CircularProgress,
  Button,
  FormControlLabel,
  Checkbox,
  Link as LinkMui,
  FormHelperText
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  heading: {
    marginTop: "auto",
    marginBottom: "auto",
    "&::before": {
      content: '"PickingWave#"'
    }
  },
  link: {
    marginLeft: "auto",
    textDecoration: "none"
  }
});

class Selection {
  constructor(quantity, sourceDocKey, sourceDocLineNumber, key, pickingWave, shippedQuantity) {
    this.quantity = quantity;
    this.sourceDocKey = sourceDocKey;
    this.sourceDocLineNumber = sourceDocLineNumber;
    this.key = key;
    this.pickingWave = pickingWave;
    this.shippedQuantity = shippedQuantity;
  }

  equals(other) {
    return (
      other.quantity === this.quantity &&
      other.sourceDocKey === this.sourceDocKey &&
      other.sourceDocLineNumber === this.sourceDocLineNumber
    );
  }
}

const PickingWaves = () => {
  const classes = useStyles();
  const [pickingWaves, setPickingWaves] = useState([]);
  const [pickingWavesLoading, setPickingWavesLoading] = useState(true);
  const [totalSelected, setTotalSelected] = useState(0);
  const [selected, setSelected] = useState([]);
  const [totalProcessGoods, setTotalProcessGoods] = useState(0);
  const [processGoods, setProcessGoods] = useState([]);
  const [processGoodsLoading, setProcessGoodsLoading] = useState(true);

  useEffect(() => {
    setPickingWavesLoading(true);
    setProcessGoodsLoading(true);

    axios.get("http://localhost:3001/sales/orders").then(r => {
      setProcessGoodsLoading(false);
      let processes = [];
      for (let i = 0; i < r.data.data.length; i++) {
        processes.push(r.data.data[i]);
      }
      setProcessGoods(processes);
    });

    axios.get("http://localhost:3001/pickingWaves").then(r => {
      setPickingWavesLoading(false);
      setPickingWaves(r.data);
    });
  }, []);

  const handleToggle = (
    quantity,
    sourceDocKey,
    sourceDocLineNumber,
    key,
    pickingWave,
    shippedQuantity,
  ) => event => {
    const s = new Selection(quantity, sourceDocKey, sourceDocLineNumber, key, pickingWave, shippedQuantity);
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].equals(s)) {
        selected.splice(i, 1);
        setTotalSelected(totalSelected - 1);
        return;
      }
    }
    selected.push(s);

    setTotalSelected(totalSelected + 1);
  };

  const handlePickingWaves = event => {
    axios.get("http://localhost:3001/sales/orders").then(r => {
      setProcessGoodsLoading(false);
      let processes = [];
      for (let i = 0; i < r.data.data.length; i++) {
        processes.push(r.data.data[i]);
      }
      setProcessGoods(processes);
    });

    axios
      .post(`http://localhost:3001/sales/processOrders`, selected)

    for (let i = 0; i < selected.length; i++) {
      const s = selected[i];
      axios.put(`http://localhost:3001/pickingWaves/${s.pickingWave}/${s.key}/${s.sourceDocKey}`, {
        shippedQuantity: s.shippedQuantity+s.quantity
      })
    }


    setTotalProcessGoods(totalProcessGoods + 1);
    setSelected([]);
    setTotalSelected(0);
  };

  if (pickingWavesLoading && processGoodsLoading) return <CircularProgress />;
  return (
    <React.Fragment>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell key="pickingwaves">Picking Waves</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pickingWaves.map(pw => {
            return (
              <ExpansionPanel key={pw.id} square className={classes.root}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>{pw.id}</Typography>
                  <Link
                    className={classes.link}
                    to={`/pickingWaves/${pw.id}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <LinkMui variant="contained" color="primary">
                      Start picking
                    </LinkMui>
                  </Link>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                      {pw.products.map(item => {
                        return (
                          <TableRow key={"" + item.key + pw.id + item.sale}>
                            <TableCell
                              component="th"
                              scope="row"
                              key={item.key}
                            >
                              <FormControlLabel
                                aria-label="Acknowledge"
                                onClick={event => event.stopPropagation()}
                                onFocus={event => event.stopPropagation()}
                                control={<Checkbox color="primary" />}
                                onChange={handleToggle(
                                  item.pickedQuantity - item.shippedQuantity,
                                  item.sale,
                                  item.index,
                                  item.key ,
                                  pw.id,
                                  item.shippedQuantity
                                )}
                                label={item.description}
                                checked={selected.some(e =>
                                  e.equals(
                                    new Selection(
                                      item.pickedQuantity-item.shippedQuantity,
                                      item.sale,
                                      item.index
                                    )
                                  )
                                )}
                                disabled={
                                  !processGoods.some(
                                    e =>
                                      e.sourceDoc === item.sale &&
                                      e.item === item.key
                                  ) || item.pickedQuantity <= item.shippedQuantity
                                }
                              />
                              <FormHelperText>
                                {item.pickedQuantity - item.shippedQuantity <= 0 ? (
                                  <Typography variant="caption">
                                    Items must be picked first!
                                  </Typography>
                                ) : (
                                  <Typography variant="caption">
                                    Items in Exit Warehouse: {item.pickedQuantity - item.shippedQuantity}
                                  </Typography>
                                )}
                              </FormHelperText>
                            </TableCell>
                            <TableCell>
                              <Typography variant="overline">
                                {item.sale}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              Quantity: {item.quantity - item.pickedQuantity} <br></br>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </TableBody>
      </Table>
      <Typography variant="overline" display="block" gutterBottom>
        {totalSelected} items selected
      </Typography>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handlePickingWaves}
        disabled={totalSelected < 1}
      >
        Create Process Order
      </Button>
    </React.Fragment>
  );
};

export default PickingWaves;
