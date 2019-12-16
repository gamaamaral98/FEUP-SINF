import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import SignIn from "./views/Login";
import Warehouse from "./views/Warehouse";
import SalesOrders from "./views/SalesOrders";
import PurchaseOrders from "./views/PurchaseOrders";
import PickingWaves from "./views/PickingWaves";
import PickingWaveDetails from "./views/PickingWaveDetails";
import NotFound from "./views/NotFound";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/login" component={SignIn} />
            <Route exact path="/warehouse" component={Warehouse} />
            <Route exact path="/sales" component={SalesOrders} />
            <Route exact path="/purchases" component={PurchaseOrders} />
            <Route exact path="/pickingWaves" component={PickingWaves} />
            <Route exact path="/sales" component={SalesOrders} />
            <Route
              exact
              path="/pickingWaves/:id"
              component={PickingWaveDetails}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
