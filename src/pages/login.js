// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const loginTemplate = require('../templates/login.handlebars');


export default () => {

    // Return the compiled template to the router
    update(compile(loginTemplate)({
    }));

    let loginbutton = document.querySelector('.loginbutton');
    let loginemail = document.querySelector('.emaillogin');
    let loginpassword = document.querySelector('.passwordlogin');
    let googlebutton = document.querySelector('.googlebutton');
    let email;
    let password;

    loginbutton.addEventListener('click', function (e) {
        e.preventDefault();
        email = loginemail.value;
        password = loginpassword.value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            localStorage.setItem("useremail", email);
            window.location.href = '/#/profile';
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

        });
    })

    googlebutton.addEventListener('click', function(e) {
        e.preventDefault();
        
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithRedirect(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log('succes google account')
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log('failed google login ')
          });
    })
    
};

/*

*/
