const functions = require('firebase-functions');
var admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.modifyDeuda = functions.firestore
    .document('deudas/{userID}')
    .onWrite((change, context) => {
      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      const document = change.after.exists ? change.after.data() : null;

      // Get an object with the previous document value (for update or delete)
      const oldDocument = change.before.data();


      admin.auth().getUser(document.deudor.uid)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
      })
      .catch(function(error) {
        console.log('Error fetching user data:', error);
      });

      // perform desired operations ...
    });