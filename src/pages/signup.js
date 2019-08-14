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
const signupTemplate = require('../templates/signup.handlebars');

function createUser(){
    let createbutton = document.querySelector('.createbutton');
    let emailform = document.getElementById('emailform');
    let passwordform = document.querySelector('.passwordform');
    let email;
    let password;
    let type = document.querySelector('.typeform');
    let name = document.querySelector('.usernameform');
    let school = document.querySelector('.schoolform');
    let telefoon = document.querySelector('.telform');
    let adres = "Molenstraat 24";
    
    email = emailform.value;
    password = passwordform.value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        var userId = firebase.auth().currentUser.uid;
        if(type.value === 'Student'){
            if(school.value === 'UniGent'){
                adres = 'St. Pietersnieuwstraat 33, 9000 Gent'
            } else if(school.value === 'HoGent'){
                adres ='Valentin Vaerwyckweg 1, 9000 Gent'
            } else if (school.value === 'Artevelde'){
                adres = 'Kattenberg 9, 9000 Gent'
            }  else if (school.value === 'KuL'){
                adres = 'Gebroeders de Smetstraat 1, 9000 Gent'
            }  else if (school.value === 'Odisee'){
                adres = 'Gebroeders de Smetstraat 1, 9000 Gent'
            }   else if (school.value === 'LUCA'){
                adres = 'Alexianenplein 1, 9000 Gent'
            }    
        firebase.database().ref('users/' + userId).set({
                        username: name.value,
                        email: email,
                        type: type.value,
                        tel: telefoon.value,
                        school: school.value,
                        adres: adres,
                        userId: userId,

                    });
                    console.log('created student');
                }else {
                    firebase.database().ref('users/' + userId).set({
                        username: name.value,
                        email: email,
                        type: type.value,
                        tel: telefoon.value,
                        userId: userId,
                    });
                    console.log('created kotbaas');
                }

    })
}
export default () => {

    // Data to be passed to the template

    // Return the compiled template to the router
    update(compile(signupTemplate)());

    const createbutton = document.getElementById('createbutton');
    createbutton.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('createbutton');
        createUser();
    })

    setInterval(function () {
        if (document.querySelector('.typeform')) {
            let typeUser = document.querySelector('.typeform').value
            if (typeUser === "Student") {
                document.getElementById('onlystudent').style.display = 'block';
            } else {
                document.getElementById('onlystudent').style.display = 'none';
            }
        }
    }, 500);
};

/*

*/
