import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import 'typeface-roboto';

import firebase from './firebase';

import GoogleLogin from './googleLogin';

const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], user : false };
  }

  componentWillMount(){
    
    var msg = []
    db.collection("listas").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          //console.log(`${doc.id} => ${doc.data()}`);
          msg.push( Object.assign( { _id: doc.id}, doc.data()) );
      });

      this.setState( { messages : msg} );

    });


    firebase.auth().getRedirectResult().then( (result) => {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
      if( user ){
        console.log('Redirect: user', user.providerData[0]);
        this.setState( {user: user.providerData[0]} );
      }else{
        console.log('Redirect: not logged');
      }
      
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });


    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        console.log('User is signed in.', user.providerData[0]);
        this.setState( {user: user.providerData[0]} );
      } else {
        this.setState( {user: null} );
      }
    });

  }

  addMessage(e){
    e.preventDefault();
  
    db.collection("listas").add({
      text: this.inputEl.value
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    this.inputEl.value = ''; // <- clear the input
  }

  render() {
    return (
      <div>
        <GoogleLogin user={this.state.user} />
        <form onSubmit={this.addMessage.bind(this)}>
          <input type="text" ref={ el => this.inputEl = el }/>
          <input type="submit"/>
        </form>
        <ul>
            { /* Render the list of messages */
              this.state.messages.map( message => <li key={message._id}>{message.text}</li> )
            }
        </ul>
      </div>
      
    );
  }
}

export default App;
