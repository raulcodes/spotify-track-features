import React, { Component } from 'react';
import '../styles/country.css';
import Select from 'react-select';
import { Circle } from 'rc-progress';

class Country extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      avg_danceability: 0.0,
      avg_acousticness: 0.0,
      avg_energy: 0.0,
      avg_valence: 0.0,
      lookup_id: ''
    };

    this.handleCountry = this.handleCountry.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:3000/graphql?query={country_today(name:"${this.state.name}"){name,lookup_id,
      avg_danceability,avg_energy,avg_valence,avg_acousticness}}`, {
      method: 'POST',
    })
    .then(res  => res.json())
    .then(json => {
      let data = json['data']['country_today'];
      this.setState({
        avg_danceability: data['avg_danceability'],
        avg_acousticness: data['avg_acousticness'],
        avg_energy: data['avg_energy'],
        avg_valence: data['avg_valence'],
        lookup_id: data['lookup_id']
      });
    });
  }

  handleCountry = (option) => {
    this.setState({ name: option.value });
    console.log(option.value);
    fetch(`http://localhost:3000/graphql?query={country_today(name:"${option.value}"){name,lookup_id,
      avg_danceability,avg_energy,avg_valence,avg_acousticness}}`, {
      method: 'POST',
    })
    .then(res  => res.json())
    .then(json => {
      let data = json['data']['country_today'];
      this.setState({
        avg_danceability: data['avg_danceability'],
        avg_acousticness: data['avg_acousticness'],
        avg_energy: data['avg_energy'],
        avg_valence: data['avg_valence'],
        lookup_id: data['lookup_id']
      });
    });
  }

  render() {
    const countries = [
      { value: 'The United States', label: 'The United States' },
      { value: 'Mexico', label: 'Mexico' },
      { value: 'Spain', label: 'Spain' },
      { value: 'UK', label: 'UK' },
      { value: 'Australia', label: 'Australia' },
      { value: 'Argentina', label: 'Argentina' }
    ];
    const defaultOption = countries[this.state.name];
    const spotify_playlist = 'https://open.spotify.com/user/spotifycharts/playlist/'

    return(
      <div className="box">
        <h3>The Top 50 tracks in</h3>
        <Select options={countries} placeholder={this.state.name} onChange={this.handleCountry} className="country-select" />
        <h3>have a current average</h3>
        <div className="chart-grid">
          <div className="chart-col">
            <h4>Danceability of:</h4>
            <div className="chart">
              <Circle percent={Math.floor(this.state.avg_danceability*100)} strokeWidth="10" trailWidth="0" strokeColor="#240b36" className="circle-chart" />
              <h3>{Math.floor(this.state.avg_danceability*100)}%</h3>
            </div>
            <h4>Acousticness of:</h4>
            <div className="chart">
              <Circle percent={Math.floor(this.state.avg_acousticness*100)} strokeWidth="10" trailWidth="0" strokeColor="#240b36" className="circle-chart" />
              <h3>{Math.floor(this.state.avg_acousticness*100)}%</h3>
            </div>
          </div>
          <div className="chart-col">
            <h4>Energy of:</h4>
            <div className="chart">
              <Circle percent={Math.floor(this.state.avg_energy*100)} strokeWidth="10" trailWidth="0" strokeColor="#240b36" className="circle-chart" />
              <h3>{Math.floor(this.state.avg_energy*100)}%</h3>
            </div>
            <h4>Valence of:</h4>
            <div className="chart">
              <Circle percent={Math.floor(this.state.avg_valence*100)} strokeWidth="10" trailWidth="0" strokeColor="#240b36" className="circle-chart" />
              <h3 className="feature">{Math.floor(this.state.avg_valence*100)}%</h3>
            </div>
          </div>
        </div>
        <a href={spotify_playlist + this.state.lookup_id} target="_blank">Check out the Playlist</a>
      </div>
    );
  }
}

export default Country;
