import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import SignIn from './views/Login';
import Warehouse from './views/Warehouse';
import SalesOrders from './views/SalesOrders';
import PurchaseOrders from './views/PurchaseOrders';
import PickingWaves from './views/PickingWaves';
import NotFound from './views/NotFound';

const axios = require('axios');

class App extends Component {
  state = {users: []}

  componentDidMount() {
    axios.get('/users')
      .then(users => this.setState({users: users.data}));
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/"><Redirect to="/login"/></Route>
            <Route path="/login" component={SignIn}/>
            <Route path="/warehouse" component={Warehouse}/>
            <Route path="/sales" component={SalesOrders}/>
            <Route path="/purchases" component={PurchaseOrders}/>
            <Route path="/waves" component={PickingWaves}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;