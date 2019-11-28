import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NotFound404 from '../components/404'
import Stock from '../components/Stock'
import Sales from '../components/Sales'
import Purchases from '../components/Purchases'
import PickingWaves from '../components/PickingWaves'

const styles = theme => ({
  
});

class Content extends React.Component {

  render() {
    const { classes, selecteditem, ...other } = this.props;

    if(selecteditem === "Stock") return(<Stock/>);
    else if(selecteditem === "Sales Orders") return(<Sales/>);
    else if(selecteditem === "Purchase Orders") return(<Purchases/>);
    else if(selecteditem === "Picking Waves") return(<PickingWaves/>);
    else if(selecteditem === "404") return(<NotFound404/>);
    return(<div></div>)
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
