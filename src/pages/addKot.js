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
    const fileUpload = document.getElementById('image');
    const uploader = document.getElementById('uploader');
    
    let imglink = "";
     user = firebase.auth().currentUser;
     console.log(user)
     if(user){
        fileUpload.addEventListener('change', (e) => {
            if (fileUpload.value !== '') {
              const file = e.target.files[0];
              const storageRef = firebase.storage().ref('images/' + file.name);
        
              storageRef.put(file);
              imglink = file.name;

              task.on('state_changed',
                function progress(snapshot){
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                    uploader.value = percentage;
                },
                function error (err){

                },
                function complete(){

                }
              
              );
            }
          });
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
                imglink: imglink
            });
            console.log('done')
    }else 
    {
        console.log('not logged in')
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

    myAddedKoten();

    update(compile(addKotTemplate)());

    let addkotbtn = document.getElementById('addkotbtn');
    addkotbtn.addEventListener('click', function(e){
        e.preventDefault();
        addKot();
    })
}