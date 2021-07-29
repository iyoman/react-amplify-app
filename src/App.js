import logo from './logo.svg';
import './App.css';

import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'
import { Storage } from 'aws-amplify'
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('My-Logger');

const listener = (data) => {
  switch (data.payload.event) {
    case 'signIn':
      logger.info('user signed in');
      break;
    case 'signUp':
      logger.info('user signed up');
      break;
    case 'signOut':
      logger.info('user signed out');
      break;
    case 'signIn_failure':
      logger.error('user sign in failed');
      break;
    case 'tokenRefresh':
      logger.info('token refresh succeeded');
      break;
    case 'tokenRefresh_failure':
      logger.error('token refresh failed');
      break;
    case 'configured':
      logger.info('the Auth module is configured');
  }
}

function App() {
  Hub.listen('auth', listener);
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user)
    document.getElementById("printuser").innerHTML = user["attributes"]["email"]
  }
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      await Storage.put('test.txt', 'Protected Content by Isaac', {
        level: 'protected',
        contentType: 'text/plain'
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
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
        <input
          type="file"
          onChange={onChange}
        />
      </header>
      <AmplifySignOut />
    </div>
  )

}



export default withAuthenticator(App, true);