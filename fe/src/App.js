import React, { Component } from 'react';
import Paperbase from './theme/Paperbase';
// import './App.css';

const axios = require('axios');

class App extends Component {
  state = {users: []}

  componentDidMount() {
    axios.get('/users')
      .then(users => this.setState({users: users.data}));
  }

  render() {
    return (
      <div className="App">
        <Paperbase>
        </Paperbase>
      </div>
    );
  }
}

export default App;