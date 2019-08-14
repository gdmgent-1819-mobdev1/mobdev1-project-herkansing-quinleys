// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const likeTemplate = require('../templates/like.handlebars');

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';

let kotId;
let kot = [];
let koten;
let myFavs;

function searchForFavs(){
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
                <p> Naam: ${snapshot.val().kotId} </p>
                <button class="deleteFav" id="deleteFave">Delete</button> 
                </div>`
            document.getElementById('myFavs').innerHTML = myFavs; 
            console.log(myFavs)
            */
            searchForKoten(kotId)
            console.log(kotId);
        } else {
            document.getElementById('myFavs').innerHTML = 'no added koten.'
            console.log('no added koten')
        };
    })

    
        searchForKoten();
    });

};

function deleteLike(){

    console.log('delete function');
}

function searchForKoten(kotId){

    fetch(url).then(response => {
        console.log(response)
        console.log('fetch')
        return response.json()
    })
    .then( data => {
        console.log(data)
        console.log("then")
        data.forEach(kot => {
            const { Naam , Huisummer , Plaats , Waarborg , Huurprijs, Aangemaakt, Straat, Type} = kot;
            if( kotId === kot.Aangemaakt){
                myFavs +=
                    `<div class="col s4">
                    <div id="card" class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src='../src/public/img/kot.jpg'>
                    </div>
                    <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${Naam}</span>
                    <p>${Straat} ${Huisummer}, ${Plaats}</p>
                    <p><a class="waves-effect waves-light btn" href="#/detail/${Aangemaakt}" data-navigo>View</a></p>
                    </div>
                    <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${Naam}<i class="material-icons right">close</i></span>
                    <p><p> Huur: ${Huurprijs} </p>
                    <p> adres: ${Straat} ${Huisummer}, ${Plaats}</p>
                    <p> Waarborg: ${Waarborg} </p>
                    <p> Type: ${Type} </p></p>
                    </p>
                    </div>
                    </div>`;
                    let loading = document.querySelector('.preloader-wrapper');
                    loading.style.display= "none";
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

            }
        })
        
    }).catch(error => {
        console.log('error');
        console.error(error);
    });
}


export default () => {
    
    searchForFavs();
    

    //document.getElementById('.kotId').innerHTML = kotId;    
    update(compile(likeTemplate)());
};