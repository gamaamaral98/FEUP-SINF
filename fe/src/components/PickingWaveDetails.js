import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@material-ui/core";

const PickingWaveDetails = props => {
  const [pickingWave, setPickingWave] = useState(null);
  const [pickingWaveLoading, setPickingWaveLoading] = useState(true);

  useEffect(() => {
    setPickingWaveLoading(true);
    axios.get(`http://localhost:3001/pickingWaves/${props.id}`).then(r => {
      setPickingWaveLoading(false);
      setPickingWave(r.data);
    });
  });

  if (pickingWaveLoading) return <CircularProgress />;
  return <Typography>{pickingWave}</Typography>;
};

export default PickingWaveDetails;
