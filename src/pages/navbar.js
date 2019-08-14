// Only import the compile function from handlebars instead of the entire library
import {
    compile
} from 'handlebars';
import update from '../helpers/update';

const {
    getInstance
} = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const headerTemplate = require('../partials/header.handlebars');

const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');

const setupUI = (user) =>{
    console.log('setup')
    if(user){
      loggedInLinks.forEach(item => item.style.display = "block");
      loggedOutLinks.forEach(item => item.style.display = "none");
      console.log(user);
      //update(compile(headerTemplate));
    }else {
      loggedInLinks.forEach(item => item.style.display = "none");
      loggedOutLinks.forEach(item => item.style.display = "block");
      console.log("geen user")
      //update(compile(headerTemplate));
    }
  }


export default () => {

    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
        setupUI(user);
        }else 
        setupUI();
    });

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems, options);
    });
    update(compile(headerTemplate)());
}