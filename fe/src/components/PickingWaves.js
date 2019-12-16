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
import { CircularProgress, Button } from "@material-ui/core";

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
  button: {
    marginLeft: "auto"
  }
});

const PickingWaves = () => {
  const classes = useStyles();
  const [pickingWaves, setPickingWaves] = useState([]);
  const [pickingWavesLoading, setPickingWavesLoading] = useState(true);

  useEffect(() => {
    setPickingWavesLoading(true);
    axios.get("http://localhost:3001/pickingWaves").then(r => {
      setPickingWavesLoading(false);
      setPickingWaves(r.data);
    });
  }, []);

  if (pickingWavesLoading) return <CircularProgress />;
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
                  {pw.state === "OPEN" ? (
                    <Button
                      className={classes.button}
                      onClick={e => e.stopPropagation()}
                      variant="contained"
                      color="primary"
                    >
                      Start picking
                    </Button>
                  ) : (
                    ""
                  )}
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
                              {item.description}
                            </TableCell>
                            <TableCell>
                              <Typography variant="overline">
                                {item.sale}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              Quantity {item.quantity}
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
    </React.Fragment>
  );
};

export default PickingWaves;
