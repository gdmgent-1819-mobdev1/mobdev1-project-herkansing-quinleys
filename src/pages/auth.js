// Firebase
const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();

firebase.auth().onAuthStateChanged( user => {
    if(user){
        setupUI(user);
    }else{
        setupUI();
    }
    
}