import React, { Component } from 'react';
import Loading from './components/loading/Loading';
import MainPage from './components/main_page/MainPage.js'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';

export default class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
        currentTeam: null,
        currentTeamID: null,
        teamMatches: null,
        error: false,
        loading: true,
        matches: null,
        standings: null,
        test: null,
      }
      this.fetchMatchesAPI = this.fetchMatchesAPI.bind(this);
      this.fetchStandingsAPI = this.fetchStandingsAPI.bind(this);
      this.updateCurrentTeam = this.updateCurrentTeam.bind(this);
      this.updateTeamMatches = this.updateTeamMatches.bind(this);
      this.getTeamStoredMatches = this.getTeamStoredMatches.bind(this);
      this.accessStoredTeamMatches = this.accessStoredTeamMatches.bind(this);
  }

  componentDidMount() {
    // this.fetchStandings();
    // this.fetchMatches();
    this.fetchMatchesAPI();
    this.fetchStandingsAPI();
  }

  componentWillUnmount() {
    localStorage.clear();
  }

  // this is returning the code from /public/index.html
  async fetchMatchesAPI() {
    const url = '/ .netlify/functions/fetchMatches';
    try {
        const response = await fetch(url);
        // const data = await response.json();
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
  }

    async fetchStandingsAPI() {
    const url = `./functions/fetchStandings.js`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

  // original fetch requests
  //   fetchStandings() {
  //   fetch('http://api.football-data.org/v2/competitions/2021/standings', {headers : {'X-Auth-Token': authToken}} )
  //     .then(response => response.json())
  //     .then(data => this.setState({standings: data, loading: false}))
  //     .then( success => { localStorage.setItem("standings", JSON.stringify(this.state.standings.standings[0].table)) } )
  //     .catch(error => console.log(error.message));
  // }

  // fetchMatches() {
  //   fetch(`http://api.football-data.org/v2/competitions/2021/matches`, {headers : {'X-Auth-Token': authToken} } )
  //     .then(response => response.json())
  //     .then(data => this.setState({matches: data, loading: false} ) )
  //     .then(success => {localStorage.setItem("matches", JSON.stringify(this.state.matches.matches) ) } )
  //     .catch(error => console.log(error.message));
  // }

  updateCurrentTeam(team, id) {
    this.setState({currentTeam: team});
    this.setState({currentTeamID: id})
  }

  updateTeamMatches(matches) {
    this.setState({teamMatches: matches});
    localStorage.setItem("teamMatches", JSON.stringify(matches));
  }

  getTeamStoredMatches(teamID, parsedStoredMatches) {
    let teamStoredMatches = [];
    parsedStoredMatches.forEach(match => {
      if(match.homeTeam.id === teamID || match.awayTeam.id === teamID) {
        teamStoredMatches.push(match);
      } 
    });
    return teamStoredMatches;
  }

  accessStoredTeamMatches() {
    let storedTeamMatches = JSON.parse(localStorage.getItem("teamMatches"));
    return storedTeamMatches
  }

  render() {
    return (
      <Router>
        <div className="app">
          {
            this.state.loading ? <Loading/> : 
            <MainPage
              standings={this.state.standings}
              updateCurrentTeam={this.updateCurrentTeam}
              currentTeam={this.state.currentTeam}
              currentTeamID={this.state.currentTeamID}
              matches={this.state.matches}
              getTeamStoredMatches={this.getTeamStoredMatches}
              updateTeamMatches={this.updateTeamMatches}
              accessStoredTeamMatches={this.accessStoredTeamMatches}
            />
          }
        </div>
      </Router>
    )
    }

}