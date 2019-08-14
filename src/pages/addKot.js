// Only import the compile function from handlebars instead of the entire library
import { compile, Visitor } from 'handlebars';
import update from '../helpers/update';
import { forEach } from 'gl-matrix/src/gl-matrix/vec2';

// Import the template to use
const addKotTemplate = require('../templates/addKot.handlebars');

// Firebase
const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();
let userId;
let user;
let usertext;

function addKot(){
    let name = document.querySelector('.name');
    let huurprijs = document.querySelector('.huurprijs');
    let telefoon = document.querySelector('.telefoon');
    let waarborg = document.querySelector('.waarborg');
    let straat = document.querySelector('.straat');
    let stad = document.querySelector('.stad');
    let postcode = document.querySelector('.postcode');
    let info = document.querySelector('.info');
    let type = document.querySelector('.type');
    let verdieping = document.querySelector('.verdieping');
    let aantalpersonen = document.querySelector('.aantalpersonen');
    let toilet = document.querySelector('.toilet');
    let douche = document.querySelector('.douche');
    let bad = document.querySelector('.bad');
    let keuken = document.querySelector('.keuken');
    let bemeubeld = document.querySelector('.bemeubeld');

     user = firebase.auth().currentUser;
     console.log(user)
     if(user){
         console.log('inside if')
            userId = user.uid;
            console.log(userId);
            let kotId = '_' + Math.random().toString(36).substr(2, 9);
            firebase.database().ref("koten/" + kotId ).set({
                userId: userId,
                kotId: kotId,
                name: name.value,
                huurprijs: huurprijs.value,
                telefoon: telefoon.value,
                waarborg: waarborg.value,
                straat: straat.value,
                stad: stad.value,
                postcode: postcode.value,
                info: info.value,
                type: type.value,
                verdieping: verdieping.value,
                aantalpersonen: aantalpersonen.value,
                toilet: toilet.value,
                douche: douche.value,
                bad: bad.value,
                keuken: keuken.value,
                bemeubeld: bemeubeld.value,
            });
            console.log('done')
    }else 
    {
        console.log('not logged in')
    }

}
function checkuser(){
    let user = firebase.auth().currentUser;
    if(user){
        let userid = user.uid;
        firebase.database().ref('/users').once('value').then(function(snapshots){
            snapshots.forEach(function(snapshot){
                if(snapshot.val().id == userid && snapshot.val().type === 'Kotbaas'){
                    loguserType = snapshot.val().type;
                }else{
                    usertext ="";
                    console.log('need to be a kotbaas');
                    usertext += 
                    `
                    <div>
                    <p>Je moet een kotbaas zijn om gebruik te maken van deze functie</p>
                    </div>
                    `
                    document.getElementById('usertext').innerHTML = usertext; 
                    let form = document.querySelector('.create');
                    form.style.display = "none";
                    let addkotbtn = document.querySelector('.addkotbtn');
                    addkotbtn.style.display = "none";
                }
            })
        })
    }else{
        console.log('you need to login');
        usertext ="";
        usertext += 
        `
        <div>
        <p>Je moet ingelogd zijn voor deze functie</p>
        </div>
        `
        document.getElementById('usertext').innerHTML = usertext; 
        let form = document.querySelector('.create');
        form.style.display = "none";
        let addkotbtn = document.querySelector('.addkotbtn');
        addkotbtn.style.display = "none";
    }
}
function myAddedKoten(){
    let addedKoten;
    let myaddedkoten;
    console.log('myaddedkoten');
    let user = firebase.auth().currentUser;
    
    if(user){
        let userId = user.uid;
        return firebase.database().ref('/koten/').once('value')
        .then(function(snapshots){
            snapshots.forEach(function(snapshot){
                if(snapshot.val().userId == userId){
                    console.log(snapshot.val().huurprijs);
                    myaddedkoten +=
                        ` <div class="card">
                        <h5> Naam: ${snapshot.val().name} </h5>
                        <h5> huurprijs: ${snapshot.val().huurprijs} </h5>
                        <p><a class="waves-effect waves-light btn" href="#/detail/${snapshot.val().kotId}" data-navigo>View</a></p>
                        </div>`
                    console.log(myaddedkoten)
                    document.getElementById('myaddedkoten').innerHTML = myaddedkoten; 
                    
                }
            });
            
        });
    } else {
        console.log('not logged in');
    }
};

export default() => {
    update(compile(addKotTemplate)());
    checkuser();
    update(compile(addKotTemplate)());

    let addkotbtn = document.getElementById('addkotbtn');
    addkotbtn.addEventListener('click', function(e){
        e.preventDefault();
        addKot();
    })
}