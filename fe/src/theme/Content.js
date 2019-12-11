import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NotFound404 from '../components/404'
import Warehouse from '../components/Warehouse'
import Sales from '../components/Sales'
import Purchases from '../components/Purchases'
import PickingWaves from '../components/PickingWaves'

const styles = theme => ({
  
});

class Content extends React.Component {

  render() {
    const { selecteditem } = this.props;

    if(selecteditem === "Warehouse") return(<Warehouse/>);
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
