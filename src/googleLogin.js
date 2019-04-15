
import React, { Component } from 'react';
import * as firebase from 'firebase';

//import firebase from './firebase';
firebase.auth().useDeviceLanguage();

// var provider = new firebase.auth.GoogleAuthProvider();

class GoogleLogin extends Component {



  clickLogin = () => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithRedirect(provider);
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  clickLogout = () => {
    firebase.auth().signOut()
    .then(function() {
      console.log('logout');
    })
    .catch(function(error) {
      console.log('error logout', error);
    });
  }

  render(){
    return (
      <div>
        {
          this.props.user ? 
          <button onClick={this.clickLogout} > LogOut </button>
          :
          <button onClick={this.clickLogin} disabled={ this.props.user === false } > LogIn </button>
        }
      </div>
      )
  }

}

export default GoogleLogin