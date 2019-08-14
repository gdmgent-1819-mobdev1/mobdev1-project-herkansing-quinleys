// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const tinderTemplate = require('../templates/tinder.handlebars');

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

let tinderDate;
let loguserType;
let userId;

function tinder(){
        let koten= []; 
    const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';
    fetch(url).then(response => {
        
        return response.json()
    })
    .then( data => {
        console.log(data) 
        search();
        function search(){
        // search random kot
        let tinder = data[Math.floor(Math.random()*data.length)];
        const { Naam , Huisummer , Plaats , Waarborg , Huurprijs, Aangemaakt, Type  } = tinder
            koten +=
            `<div id="card" class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img class="activator" src='../src/public/img/kot.jpg'>
            </div>
            <div class="card-content">
              <span class="card-title activator grey-text text-darken-4">${Naam}</span>
            </div>
            <div class="card-reveal">
              <span class="card-title grey-text text-darken-4">${Naam}<i class="material-icons right">close</i></span>
              <p><h5> Type: ${Huisummer} </h5>
              <h5> Type: ${Plaats} </h5>
              <h5> Waarborg: ${Waarborg} </h5>
              <h5> Type: ${Type} </h5></p>
            </div>
                
                
            </div>`;
            document.getElementById('koten').innerHTML = koten; 
            console.log(tinder);
            console.log('searching');
            tinderDate = tinder.Aangemaakt;
            console.log(tinder.Aangemaakt);
        };
    }).catch(error => {
        console.log('error');
        console.error(error);
    }); 


}
function checkUser(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            let userid = user.uid
            firebase.database().ref('/users').once('value').then(function(snapshots){
                snapshots.forEach(function(snapshot){
                    if(snapshot.val().id == userId && snapshot.val().type === "Student"){
                        console.log(snapshot.val().type)
                        loguserType = snapshot.val().type;
                        let start = document.querySelector('.start');
                        start.style.display = "inline-block"
                        let koten = "";
                        document.getElementById('koten').innerHTML = koten; 
                        return
                    }else{

                        let start = document.querySelector('.start');
                        start.style.display ='none';
                        console.log('not a student')
                        let koten = "";
                        koten +=
                        `
                        <div>
                        <p>Je moet een student zijn om deze feature te kunnen gebruiken</p>
                        </div>
                        `
                        document.getElementById('koten').innerHTML = koten; 
                        console.log(koten);
                    }
                })
            })
        }else{
            let start = document.querySelector('.start');
            start.style.display ='none';
            console.log('not logged in')
            let koten = "";
            koten +=
            `
            <div>
            <p>Je moet ingelogd zijn om deze feature te kunnen gebruiken</p>
            </div>
            `
            document.getElementById('koten').innerHTML = koten; 
            console.log(koten);
        }
    })
}
function liked (){
    console.log('like');
    firebase.auth().onAuthStateChanged(function(user){
        userId = user.uid;
        console.log(userId);
        console.log(tinderDate+ 'test') 
        // add like to database
        let favId = '_' + Math.random().toString(36).substr(2, 9);
        let useremail = localStorage.getItem("useremail");
        firebase.database().ref("favorites/" + favId ).set({
            userId: userId,
            kotId: tinderDate,
        });
        console.log(userId);
    })
}

function disliked(){
    console.log('disllike')
    tinder();
}
export default () => {
    //tinder();
    
    update(compile(tinderTemplate)());
    checkUser();
    let refresh = document.querySelector('.refresh');
    refresh.addEventListener("click", function(){
        //niets
        console.log('refreshed');
        tinder();
        liked();

    });
    let dislike = document.querySelector('.dislike');
    dislike.addEventListener("click", function(){
        //niets
        console.log('disliked');
        disliked();

    });
    dislike.style.display = 'none';
    refresh.style.display ='none';

    let start = document.querySelector('.start');
    start.addEventListener("click", function(){
        console.log('start');
        
        tinder();

        start.style.display ='none';

        dislike.style.display = 'block';
        refresh.style.display ='block'
    })
    console.log('refresh');
};
