// Only import the compile function from handlebars instead of the entire library
import { compile, Visitor } from 'handlebars';
import update from '../helpers/update';
import { userInfo } from 'os';

// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

// Firebase
const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();
let kotId;
let noaddedkoten ; 
let nolikedkoten;
let myFavs = "";
let myInfo = "";
let i = 0;
let myEditForm = "";
let url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';

function searchFavorites(){
    console.log('searching');
    var userId = firebase.auth().currentUser.uid;
    myFavs = '';
    return firebase.database().ref('favorites/').once('value').then(function(snapshots) {
    //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    console.log('database')
    console.log(userId);
    snapshots.forEach(function(snapshot){
        if(snapshot.val().userId == userId){
            console.log('in if')
            console.log(snapshot.val().kotId);
            kotId=snapshot.val().kotId;
            /*
            myFavs +=
                `<div class="card">
                <h5> Naam: ${snapshot.val().kotId} </h5>
                <button class="deleteFav" id="deleteFave">Delete</button> 
                </div>`
            document.getElementById('myFavs').innerHTML = myFavs; 
            console.log(myFavs)
            */
            searchKoten(kotId)
            console.log(kotId);
            let content = document.getElementById('content');
            content.style.display = "block";
            let seemorebtn = document.querySelector('.seemorebtn');
            seemorebtn.style.display = "inline-block";
        } else {
            nolikedkoten = '';
            nolikedkoten +=
                    `
                    <div class="row">
                        <p>Nog geen koten geliked. Ga gerust op zoek naar een kot die jij leuk vindt!</p>
                        <p><a class="waves-effect waves-light btn" href="#/koten/" data-navigo>Zoeken naar koten</a></p>
                    </div>
                    `
            document.getElementById('myFavs').innerHTML = nolikedkoten;
            console.log('no added koten');
            let content = document.getElementById('content');
            content.style.display = "block";
            let seemorebtn = document.querySelector('.seemorebtn');
            seemorebtn.style.display = "none";
        };
    })
})
}

function searchKoten(kotId){
    i = 0;
    fetch(url).then(response => {
        console.log(response)
        console.log('fetch')
        return response.json()
    })
    .then( data => {
        console.log(data)
        console.log("then")
        data.forEach(kot => {
            const { Naam , Huisummer , Plaats , Waarborg , Huurprijs, Aangemaakt, Type } = kot;
            if( kotId === kot.Aangemaakt){
                if(i < 3){
                    i = i + 1;
                    console.log(i);
                myFavs +=
                `
                <div class="col s4">
                <div id="card" class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator" src='../src/public/img/kot.jpg'>
                </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">${Naam}</span>
                  <p><a class="waves-effect waves-light btn" href="#/detail/${Aangemaakt}" data-navigo>View</a></p>
                </div>

                    </div>
                    </div>
                    `;
                    document.getElementById('myFavs').innerHTML = myFavs; 
                console.log('if');
                console.log(kotId);
                console.log(kot);
                console.log('gelukt!')
                
                let deleteBtn = document.querySelector('.delete');
                deleteBtn.addEventListener("click", function(){
                    console.log('delete');
                    deleteLike()
                });
            }else{

                return;
            }
            }
        })
        
    }).catch(error => {
        console.log('error');
        console.error(error);
    });
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
                        ` 
                        <div class="col s4">
                        <div id="card" class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src='../src/public/img/kot.jpg'>
                        </div>
                        <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${snapshot.val().name}</span>
                        <p><a class="waves-effect waves-light btn" href="#/detail/${snapshot.val().kotId}" data-navigo>View</a></p>
                        </div>
                        <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">${snapshot.val().name}<i class="material-icons right">close</i></span>
                        <p><h5> Type: ${snapshot.val().huurprijs} </h5>
                        <h5> Type: ${snapshot.val().straat} </h5>
                        <h5> Waarborg: ${snapshot.val().telefoon} </h5>
                        </p>
                        </div>
                        </div>`
                    console.log(myaddedkoten)
                    document.getElementById('addedkoten').innerHTML = myaddedkoten; 
                    
                    
                }else{
                    noaddedkoten = "";
                    noaddedkoten +=
                    `
                    <div class="row">
                        <p>Nog geen koten aangemaakt. Maak er gerust aan!</p>
                        <p><a class="waves-effect waves-light btn" href="#/addkot/" data-navigo>Maak aan</a></p>
                    </div>
                    `

                    document.getElementById('addedkoten').innerHTML = noaddedkoten;
                }
            });
            
        });
    } else {
        console.log('not logged in');
        
    }
};
let user;
let email;
let name;
let typeUser;
let nameUser;
let telephoneUser;
let adresUser;
let schoolUser;

function getUserInfo(){
    var userId = firebase.auth().currentUser.uid;
    console.log(userId);
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        typeUser = (snapshot.val() && snapshot.val().type) || 'Anonymous';
        nameUser = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        telephoneUser = (snapshot.val() && snapshot.val().tel) || 'Anonymous';
        if(typeUser === 'Student'){
            adresUser = (snapshot.val() && snapshot.val().adres) || 'No Adress';
            schoolUser = (snapshot.val() && snapshot.val().school) || 'No Adress';
            let onlykotbaas = document.getElementById('onlykotbaas');
            onlykotbaas.style.display = "none"
          }else {
            console.log('kotbaas');
            let onlykotbaas = document.getElementById('onlykotbaas');
            onlykotbaas.style.display = "block"
          }
          getProfile();
          
    });
}
function getProfile(){
    myInfo = "";
   console.log('getprofile');
    myInfo += 
    `
    <div>
    <p>${typeUser}</p>
    <p>${nameUser}</p>
    <p>${adresUser}</p>
    <p>${schoolUser}</p>
    <p>${telephoneUser}</p>
    </div>
    `;
    let loading = document.querySelector('.preloader-wrapper');
    loading.style.display= "none";
    document.getElementById('profileuser').innerHTML = myInfo;
   myAddedKoten();
   searchFavorites();
}

export default () => {
    update(compile(profileTemplate)());



    getUserInfo();

    let logout = document.querySelector('.logout');
    logout.addEventListener("click", (e) => {
        console.log('outlog');
        e.preventDefault();
        firebase.auth().signOut().then(function() {
            console.log('succesvolle logout')
            location.reload();
        }).catch(function(error) {
            console.log(error)
        });
        });
        myFavs="";
        update(compile(profileTemplate)());

        let edit = document.getElementById('edit');
        edit.addEventListener("click", function(e){
            e.preventDefault();
            console.log('edit');
            editform.style.display = "block";
        })
        let content = document.getElementById('content');
        content.style.display = "none";
    };
        


