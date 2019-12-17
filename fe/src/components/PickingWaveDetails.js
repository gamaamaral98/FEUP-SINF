import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography } from "@material-ui/core";

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
  return <Typography>{pickingWave.toString()}</Typography>;
};

export default PickingWaveDetails;
