var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDKKSI99uYjxQkd6LClpQqSCSTq90mq81M",
  authDomain: "dev-hom-e.firebaseapp.com",
  databaseURL: "https://dev-hom-e.firebaseio.com",
  projectId: "dev-hom-e",
  storageBucket: "dev-hom-e.appspot.com",
  messagingSenderId: "954518550753"
};

firebase.initializeApp(config);

module.exports = firebase.database();
