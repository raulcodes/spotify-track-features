import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Country from './components/Country';

class App extends Component {
  componentDidMount() {
    fetch('http://localhost:3000/graphql?query={countries_today{name,id,avg_danceability,avg_energy}}', {
      method: 'POST',
    })
    .then(res => console.log(res.json()));
  }


  fetch_data = () => {
    fetch('http://localhost:3000/graphql?query={countries_today{name,id,avg_danceability,avg_energy}}', {
      method: 'POST'
    }).then(response => {
      console.log(response.body);
    })
  }

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
