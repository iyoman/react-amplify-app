import logo from './logo.svg';
import './App.css';

import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'
import { Storage } from 'aws-amplify'
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('My-Logger', "INFO");

const listener = (data) => {
  switch (data.payload.event) {
    case 'signIn':
      console.log("signed in");
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
    document.getElementById("printuser").innerHTML = "Signed in as " + user["attributes"]["email"]
  }

  var file
  async function onChange(e) {
    file = e.target.files[0];
  }

  async function uploadfile() {
    try {
      await Storage.put(file.name, file, {
        level: 'private',
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    },
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  var filelist = {}
  var filelisthtml = ""
  async function listfiles() {
    Storage.list('', { level: 'private' })
    .then(result => filelist = result)
    .catch(err => console.log(err));
    console.log(filelist)

    filelisthtml = ""
    for (let i = 0; i < filelist.length; i++) {
      filelisthtml += '<li>'+filelist[i]["key"]+'</li>'
    }
    document.getElementById("filelist").innerHTML = filelisthtml
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
          class="inline"
          onChange={onChange}
        />
        <button onClick={uploadfile} class="inline">
          Upload File
        </button>
        
        <button onClick={listfiles}>
          List your Files
        </button>
        <ul id="filelist"></ul>
      </header>
      <AmplifySignOut />
    </div>
  )

}

export default withAuthenticator(App, true);