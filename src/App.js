import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import firebase from './firebase';

const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }; // <- set up react state
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
