import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Country from './components/Country';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="grid">
          <Country name="The United States" />
          <Country name="Mexico" />
        </div>
      </div>
    );
  }
}

export default App;
