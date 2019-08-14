importScripts("https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/6.3.0/firebase-messaging.js");

const firebaseInstance = require('firebase');

const config = {
    apiKey: 'AIzaSyCQ5s_LOxD72LS9jwp9I_RdOG3s5Dqgtk4',
    authDomain: 'mobdev1-b7938.firebaseapp.com',
    databaseURL: 'https://mobdev1-b7938.firebaseio.com',
    projectId: 'mobdev1-b7938',
    storageBucket: 'mobdev1-b7938.appspot.com',
    messagingSenderId: '217448293241',
    appId: '1:217448293241:web:4649553a63a99d2c',
  };

firebaseInstance.initializeApp(config);

const messaging = firebaseInstance.messaging();

