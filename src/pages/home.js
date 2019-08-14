// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

let gebruikersnaam;
let gebruikerstype;
let recKots;

function logoutUser(){
  firebase.auth().signOut().then(function(){
    window.reload();
  }).catch(function(error){

  });
}
function getUser(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      let userId = user.uid;
      console.log(user.uid);
    firebase.database().ref('/users').once('value').then(function(snapshots){
      //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      console.log('database')
      console.log(userId);
      snapshots.forEach(function(snapshot){
        console.log('in foreach')
        console.log(snapshot.val().userId);
          if(snapshot.val().userId === userId){
            gebruikersnaam = snapshot.val().username;
            gebruikerstype = snapshot.val().type;
            console.log(gebruikersnaam);
            console.log(gebruikerstype);
            makemenu()
            return
  }else{
    console.log('not')
    makemenu()
  }
})
    
  })
}else{
  console.log('no user logged in ');
}
  })
}
function makemenu(){
  let user;
  let email;
  const loggedInLinks = document.querySelectorAll('.logged-in');
  const loggedOutLinks = document.querySelectorAll('.logged-out');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById('username').innerHTML = gebruikersnaam;
      document.getElementById('useremail').innerHTML = user.email;
      loggedInLinks.forEach(item => item.style.display = "block");
      loggedOutLinks.forEach(item => item.style.display = "none");
      email = user.email;
      update(compile(homeTemplate)({ email }));
      console.log(user);
    if(gebruikerstype === 'Kotbaas'){
      console.log('inside kotbaas');
      document.getElementById('addkot').style.display = "block";
      document.getElementById('addkot1').style.display = "block";
      document.getElementById('tinder').style.display = "none";
    }else {
      document.getElementById('addkot').style.display = "none";
      document.getElementById('addkot1').style.display = "none";
      document.getElementById('tinder').style.display = "block";
    }
    } else {
      email = 'visitor';
      loggedInLinks.forEach(item => item.style.display = "none");
      loggedOutLinks.forEach(item => item.style.display = "block");
      update(compile(homeTemplate)({ email }));
      console.log('no login')
    }
  });
}
function getRecKot(){
    // Return the compiled template to the router
    const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';
    const url2 = 'https://api.unsplash.com/search/collections?page=1&query=house';
    
    let koten = [];
    let allKoten;
    let i = 0;
    fetch(url).then(response => {
        console.log(response)
        console.log('koten')
        return response.json()
    })
    .then( data => {
        console.log(data)
        allKoten = data;
        //console.log(data.{{first & name}});
        data.forEach(kot => {
          if(i < 3){

          
            const { Naam , Huisummer , Plaats , Waarborg , Type , Aangemaakt, Straat, Huurprijs } = kot
            //console.log(i);
            koten +=
            `<div id="card" class="card card${i}">
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
              <p>
              <p> Huur: ${Huurprijs} </p>
              <p> adres: ${Straat} ${Huisummer}, ${Plaats}</p>
              <p> Waarborg: ${Waarborg} </p>
              <p> Type: ${Type} </p>
              </p>
            </div>
                
                
            </div>`;
            console.log(koten);
            document.getElementById('recKots').innerHTML = koten;
            i ++;
          }else{
            return;
          }
        });
        
    }).catch(error => {
        console.log('error');
        console.error(error);
    });
}
export default () => {
  // Data to be passed to the template
  getUser();
  update(compile(homeTemplate)());



      document.addEventListener('DOMContentLoaded', function() {
          console.log('test')
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

  });

  document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    console.log(M.AutoInit());
    var elems = document.querySelectorAll('.carousel');
    let options = {
      fullWidth: true,
      indicators: true
    }
    var instances = M.Carousel.init(elems, options);
  });
  let logout = document.getElementById('logout');
  logout.addEventListener('click', function(e){
    e.preventDefault();
    logoutUser();
    console.log('logout');
  })

  let logout1 = document.getElementById('logout1');
  logout1.addEventListener('click', function(e){
    e.preventDefault();
    logoutUser();
    console.log('logout');
  })
  getRecKot();
};
