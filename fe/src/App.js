import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Stock from './views/Stock';
import SalesOrders from './views/SalesOrders';
import PurchaseOrders from './views/PurchaseOrders';
import PickingWaves from './views/PickingWaves';
import NotFound from './views/NotFound'

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
            <Route exact path="/"><Redirect to="/stock"/></Route>
            <Route path="/stock" component={Stock}/>
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