import firebase from 'firebase'
//require("firebase/firestore");
var config = {
  apiKey: "AIzaSyDmacfja44gFk98OaGVNNBMKeAw8uryexk",
  authDomain: "desayuneitor-3mil-11uno.firebaseapp.com",
  databaseURL: "https://desayuneitor-3mil-11uno.firebaseio.com",
  projectId: "desayuneitor-3mil-11uno",
  storageBucket: "desayuneitor-3mil-11uno.appspot.com",
  messagingSenderId: "1080456440979"
};
var fire = firebase.initializeApp(config);
export default fire;