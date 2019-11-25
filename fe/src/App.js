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
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
        </Paperbase>
      </div>
    );
  }
}

export default App;