import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import NotFound404 from "../components/404";
import Warehouse from "../components/Warehouse";
import Sales from "../components/Sales";
import Purchases from "../components/Purchases";
import PickingWaves from "../components/PickingWaves";
import PickingWaveDetails from "../components/PickingWaveDetails";

const styles = theme => ({});

class Content extends React.Component {
  render() {
    const { selecteditem } = this.props;

    if (selecteditem === "Warehouse") return <Warehouse />;
    else if (selecteditem === "Sales Orders") return <Sales />;
    else if (selecteditem === "Purchase Orders") return <Purchases />;
    else if (selecteditem === "Picking Waves") {
      if (this.props.route.match.params.id) {
        return (
          <PickingWaveDetails
            route={this.props.route}
            id={this.props.route.match.params.id}
          />
        );
      } else {
        return <PickingWaves />;
      }
    } else return <NotFound404 />;
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Content);
