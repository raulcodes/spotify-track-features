import React, { Component } from 'react';
import '../styles/country.css';
import Select from 'react-select';

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
      { value: 'UK', label: 'UK' }
    ];
    const defaultOption = countries[this.state.name];
    const spotify_playlist = 'https://open.spotify.com/user/spotifycharts/playlist/'

    return(
      <div className="box">
        <h3>The Top 50 tracks in the</h3>
        <Select options={countries} placeholder={this.state.name} onChange={this.handleCountry} className="country-select" />
        <h3>have a current:</h3>
        <h4>Danceability of: <br />{this.state.avg_danceability}</h4>
        <h4>Acousticness of: <br />{this.state.avg_acousticness}</h4>
        <h4>Energy of: <br />{this.state.avg_energy}</h4>
        <h4>Valence of: <br />{this.state.avg_valence}</h4>
        <a href={spotify_playlist + this.state.lookup_id} target="_blank">Check out the Playlist</a>
      </div>
    );
  }
}

export default Country;
