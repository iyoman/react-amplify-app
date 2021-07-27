import logo from './logo.svg';
import './App.css';

import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

let user = await Auth.currentAuthenticatedUser();

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Welcome to Hexatank!
      </p>
      <p id="printuser"></p>
    </header>
  </div>
);

window.onload = function(){
  document.getElementById('printuser').innerHTML = user;
};

export default withAuthenticator(App);