import logo from './logo.svg';
import './App.css';

import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';


function App() {
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user)
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Hexatank!
        </p>
        <button onClick={checkUser}>
          Check the current user
        </button>
        <p id="printuser"></p>
      </header>
      <p id="nothead">not a header</p>
    </div>
  )

}

export default withAuthenticator(App, true);