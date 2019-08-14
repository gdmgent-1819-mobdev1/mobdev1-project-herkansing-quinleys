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


const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');


console.log(loggedInLinks)

export default () => {

}