import React, { Component } from 'react';
import authToken from './AuthToken';
import Loading from './components/loading/Loading';
import MainPage from './components/main_page/MainPage.js'
import './App.css'

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
      }
      this.fetchStandings = this.fetchStandings.bind(this);
      this.fetchMatches = this.fetchMatches.bind(this);
      this.updateCurrentTeam = this.updateCurrentTeam.bind(this);
      this.updateTeamMatches = this.updateTeamMatches.bind(this);
      this.getTeamStoredMatches = this.getTeamStoredMatches.bind(this);
      this.accessStoredTeamMatches = this.accessStoredTeamMatches.bind(this);
  }

  componentDidMount() {
    this.fetchStandings();
    this.fetchMatches();
  }

  componentWillUnmount() {
    // getting the following error when refreshing Matches. 
    // Warning: Can't perform a React state update on an unmounted component. 
    // This is a no-op, but it indicates a memory leak in your application. 
    // To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

    // using local storage to fix above issue, still need to cancel subscriptions

    // double check when this clears, need it available on the fixtures page for when I switch back
    localStorage.clear();
  }

  fetchStandings() {
    fetch(`http://api.football-data.org/v2/competitions/2021/standings`, {headers : {'X-Auth-Token': authToken}} )
      .then(response => response.json())
      .then(data => this.setState({standings: data, loading: false}))
      .then( success => { localStorage.setItem("standings", JSON.stringify(this.state.standings.standings[0].table)) } )
      .catch(error => console.log(error.message));
  }  

  fetchMatches() {
    fetch(`http://api.football-data.org/v2/competitions/2021/matches`, {headers : {'X-Auth-Token': authToken} } )
      .then(response => response.json())
      .then(data => this.setState({matches: data, loading: false} ) )
      .then(success => {localStorage.setItem("matches", JSON.stringify(this.state.matches.matches) ) } )
      .catch(error => console.log(error.message));
  }

  updateCurrentTeam(team, id) {
    this.setState({currentTeam: team});
    this.setState({currentTeamID: id})
  }

  // refactor this function to interact with localStorage in order for matches render on browser reload
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
    )
    }

}