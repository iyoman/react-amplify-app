import logo from './logo.svg';
import './App.css';

import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'
import { Storage } from 'aws-amplify'
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('My-Logger');

const listener = (data) => {
  console.log(data.payload.event)
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
    await Auth.currentAuthenticatedUser()
      .then(result => userhandler(result))
      .catch(err => console.log(err))
  }
  checkUser()

  var user
  function userhandler(result) {
    user = result
    document.getElementById("printuser").innerHTML = "Signed in as " + user["attributes"]["email"]
    logger.debug("user: ", user)
  }

  var file
  async function onChange(e) {
    file = e.target.files[0];
  }

  async function uploadfile() {
    try {
      document.getElementById("status").innerHTML = "Uploading..."
      await Storage.put(file.name, file, {
        level: 'private',
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          document.getElementById("status").innerHTML = `Uploaded: ${progress.loaded}/${progress.total}`
        },
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  var filelisthtml = ""
  async function listfileshandler() {
    document.getElementById("status").innerHTML = "Working..."
    Storage.list('', { level: 'private' })
      .then(result => listfiles(result))
      .catch(err => console.log(err));
  }

  let filekeyslist = []
  async function listfiles(files) {
    console.log(files)
    let filesrc = ""
    filekeyslist = []
    filelisthtml = ""
    for (let i = 0; i < files.length; i++) {
      const key = files[i]["key"]
      const quotekey = "\"" + key + "\""
      filesrc = await getfile(key)
      filelisthtml += '<li id=' + key + '>File Name: ' + key + ' - <img id="listimg" src=' + filesrc + '></img></li>'
      filekeyslist.push(key)
    }
    document.getElementById("status").innerHTML = "Retrieved " + files.length + " files"
    document.getElementById("filelist").innerHTML = filelisthtml
    let listelems = document.getElementById("filelist").children
    for (let i = 0; i < listelems.length; i++) {
      const elem = listelems[i];
      let button = document.createElement("button")
      button.innerHTML = "Remove File"
      button.class = "inline"
      button.id = "stylebutton"
      button.onclick = function() {removefile(elem.id)}
      elem.appendChild(button)
    }
  }

  async function getfile(path) {
    try {
      const signedURL = await Storage.get(path, {
        level: 'private', // defaults to `public`
        download: false, // defaults to false
      });
      console.log("sign - " + signedURL)
      return signedURL
    } catch (error) {
      console.log(error)
    }
  }

  async function removefile(path) {
    try {
      document.getElementById("status").innerHTML = "Removing " + path + "..."
      const remove = await Storage.remove(path, { level: 'private' });
      console.log("removing - " + remove)
    } catch (error) {
      console.log(error)
    }
    document.getElementById("status").innerHTML = "Removed"
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Hexatank!
        </p>
        <p id="printuser"></p>
        <input
          type="file"
          class="inline"
          onChange={onChange}
        />
        <button onClick={uploadfile} class="inline" id="stylebutton">
          Upload File
        </button>
        <button onClick={listfileshandler} id="stylebutton">
          List your Files
        </button>
        <p id="status"></p>
        <p>---------Files---------</p>
        <ul id="filelist"></ul>
      </header>
      <AmplifySignOut />
    </div>
  )

}

export default withAuthenticator(App, true);