import logo from './logo.svg';
import './App.css';

import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);


function App() {
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user)
  }
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
}
  


window.onload = function(){
  document.getElementById('printuser').innerHTML = "not done yet";
};

export default withAuthenticator(App,true);