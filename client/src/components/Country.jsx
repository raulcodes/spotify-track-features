import React, { Component } from 'react';
import '../styles/country.css';

class Country extends Component {
  constructor(props) {
    super(props);

    this.state = {
      f: true
    };
  }

  render() {
    return(
      <div className="box">
        <h3>The Top 50 tracks in the</h3>
        <h3>{this.props.name}</h3>
        <h3>have a current:</h3>
      </div>
    );
  }
}

export default Country;
