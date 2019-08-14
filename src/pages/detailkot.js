// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

import mapboxgl from 'mapbox-gl';
import config from '../config';

mapboxgl.accessToken = 'pk.eyJ1IjoicXVpbmxleXMiLCJhIjoiY2p5YTB5anUwMDlibDNubzZ0ZnlkNm80OCJ9.xN5oodKkx7BmgSbcwPVLzw'
// Import the template to use
const detailTemplate = require('../templates/detailkot.handlebars');
// Instantiate a map and platform object:
// Instantiate a map and platform object:


const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();
let i = 0;
const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';
let detail = [];
const detailintro = 'De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw De standaard Lorem Ipsum passage, in gebruik sinds de 16e eeuw';
const detailtext = 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure';
let kotId;
let longi;
let lati;
let studentlat;
let studentlng;
let checkFavId;
let adres = '';
var platform = new H.service.Platform({
  'apikey': 'PgdnLpPmSCzw13lrxYay_HhMMokeRq0wogziXC_alcM'
});
let foundlike;
let typeUser;
let adresUser;
let userlng = "51.05";
let userlat = "3.7167";
let chatbtn;
let kotbaasUser = '85gZcRz8GURLcZ340NdrHGUZj6q2'
let userId;

function getUserType(){
  
  let loggedinuser = firebase.auth().currentUser

  if(loggedinuser){

    userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      typeUser = (snapshot.val() && snapshot.val().type) || 'Anonymous';
      if(typeUser === 'Student'){
        adresUser = (snapshot.val() && snapshot.val().adres) || 'No Adress';
        getStudentLongLat(adresUser);
        console.log('student')
        let chatbtn = document.getElementById('btns');
        chatbtn.style.display = "inline-block";
        let likebtn = document.getElementById('btns');
        likebtn.style.display = "inline-block"
      }else {
        console.log('kotbaas')
        userlng = null;
        userlat = null;
        let chatbtn = document.getElementById('btns');
        chatbtn.style.display = "none";
        let likebtn = document.getElementById('btns');
        likebtn.style.display = "inline-block"
      }
      console.log(typeUser);
      console.log(adresUser);
    });
  }else{
    console.log('nouser')
    let likebtn = document.getElementById('btns');
    likebtn.style.display = "none"
    let chatbtn = document.getElementById('chatbtn')
    chatbtn.style.display = "none"
    let dislikebtn = document.getElementById('dislikebtn')
    dislikebtn.style.display = "none"
  }

}
function checkliked(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
    foundlike = false;
      userId = user.uid;
      console.log(userId);
      console.log(kotId+ 'test')
      firebase.database().ref("favorites/").once('value').then(function(snapshots){
        snapshots.forEach(function(snapshot){
          if(snapshot.val().userId == userId && snapshot.val().kotId == kotId){
            let likebtn = document.getElementById('btns');
            likebtn.style.display = "none";
            let dislikebtn = document.getElementById('dislikebtn');
            dislikebtn.style.display = "inline-block";
            foundlike = true;
            checkFavId = snapshot.val().favId;
          } 
      })
      })
      if(foundlike == false){
        let likebtn = document.getElementById('btns');
        likebtn.style.display = "inline-block";
        let dislikebtn = document.getElementById('dislikebtn');
        dislikebtn.style.display = "none";
      }
    }else{
      console.log('no logged in user')
    }
})
}
function like()
{
  console.log('like');
  firebase.auth().onAuthStateChanged(function(user){
    foundlike = false;
      userId = user.uid;
      console.log(userId);
      console.log(kotId+ 'test')
      firebase.database().ref("favorites/").once('value').then(function(snapshots){
        snapshots.forEach(function(snapshot){
          if(snapshot.val().userId == userId && snapshot.val().kotId == kotId){
            let likebtn = document.getElementById('btns');
            likebtn.style.display = "none";
            let dislikebtn = document.getElementById('dislikebtn');
            dislikebtn.style.display = "inline-block";
            foundlike = true;
          } 

      })
      }).then(function(){
        if(foundlike == false){
        // add like to database
        let favId = '_' + Math.random().toString(36).substr(2, 9);
        let useremail = localStorage.getItem("useremail");
        firebase.database().ref("favorites/" + favId ).set({
        userId: userId,
        kotId: kotId,
        favId: favId,
        });
        checkFavId = favId;
        console.log(userId);
        console.log('liked');
        let likebtn = document.getElementById('btns');
        likebtn.style.display = "none";
        let dislikebtn = document.getElementById('dislikebtn');
        dislikebtn.style.display = "inline-block";
        }
})

  })
}
function map(lati ,longi){
    // Mapbox code
    if (config.mapBoxToken) {
      mapboxgl.accessToken = config.mapBoxToken;
      // eslint-disable-next-line no-unused-vars
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lati, longi],
        zoom: 9,
      });
      var marker = new mapboxgl.Marker()
      .setLngLat([lati, longi])
      .addTo(map);
      var marker2 = new mapboxgl.Marker()
      .setLngLat([userlng, userlat])
      .addTo(map);
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: 'true'
          },
          trackUserLocation: 'true'
          }));

} else {
  console.error('Mapbox will crash the page if no access token is given.');
}
}
function getStudentLongLat(adresUser){
  console.log('getlonglatstudent')
  var geocodingParams = {
      searchText : adresUser
  };

  var onResult = function(result) {
    var locations = result.Response.View[0].Result,
      position,
      marker;
    // Add a marker for each location found
    for (i = 0;  i < locations.length; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    console.log(position)
    userlat = position.lat;
    userlng = position.lng;

  };
  console.log(userlat)
  console.log(userlng)

}
        // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();

    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    geocoder.geocode(geocodingParams, onResult, function(e) {
      alert(e);
      
    });
}

function getLongLat(adres){
  console.log('getlonglat')
  var geocodingParams = {
      searchText : adres
  };

  var onResult = function(result) {
    var locations = result.Response.View[0].Result,
      position,
      marker;
    // Add a marker for each location found
    for (i = 0;  i < locations.length; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    console.log(position)
    lati = position.lat;
    longi = position.lng;
    console.log(lati);
    console.log(longi);
    map(longi,lati);
    }
  };
  
        // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();

    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    geocoder.geocode(geocodingParams, onResult, function(e) {
      alert(e);
      
    });
}
function searchKot(id){
  fetch(url).then(response => {
    console.log(response);
    return response.json()
    i = 0;
  })
  .then( data => {
    detail = [];
    let myaddedkoten = [];
    console.log(data)
    data.forEach(kot => {
        if(id === kot.Aangemaakt){
          console.log('gevonden');
          kotId = kot.Aangemaakt;
          detail = "";
          detail +=
          `
          <div class="header-detail">
            <img class="detail-img" src='../src/public/img/kot.jpg'>
          </div>
          <div class="container">
          <h1>${kot.Naam}</h1>
          
          <div class="col s12 m6">
          <div id="card card-detail" class="card card-detail">
            <p> Naam: <strong>${kot.Naam} </strong></p>
            <p> adres: <strong>${kot.Straat} ${kot.Huisummer},${kot.Plaats}</strong></p>
            <p> bemeubeld: <strong>${kot.Opties}</strong> </p>
            <p> Type: <strong>${kot.Type}</strong> </p>
            <p> Huurprijs: <strong>${kot.Huurprijs}</strong> </p>
            <p> Waarborg: <strong>${kot.Waarborg}</strong> </p>
          </div>
          </div>
          <div class="detail-text">
            
            <p>${detailintro}</p>
            <p>${detailtext}</p>
          </div>
          <div id="map"></div>
          </div>
          `
          console.log(detail);
          document.getElementById('detail').innerHTML = detail;
          let loading = document.getElementById('loading');
          loading.style.display = "none"
          i = 0;
          adres = kot.Huisummer + ' ' + kot.Straat + ', ' + kot.Plaats;
          console.log(adres);
          getLongLat(adres);
          checkliked();
        } else {
          if(i < 1){
            //searchaddedkoten(id);
            i ++;
            console.log(i);
          }
        }
      }) 
  }).catch(error => {
    console.log('error');
    console.error(error);
    //searchaddedkoten(id);
  });
  }

  function searchaddedkoten(id){
    console.log('searchaddedkoten');
        return firebase.database().ref('/koten/').once('value')
        .then(function(snapshots){
          console.log('inside')
            snapshots.forEach(function(snapshot){
                if(snapshot.val().kotId == id && snapshot.val().userId == userId){
                    console.log(snapshot.val().huurprijs);
                    kotId == snapshot.val().kotId;
                    detail = "";
                    detail +=
                        `          
                        <div class="header-detail">
                        <img class="detail-img" src='../src/public/img/kot.jpg'>
                      </div>
                      <div class="container">
                      <h1>${snapshot.val().name}</h1>
                      
                      <div class="col s12 m6">
                      <div id="card card-detail" class="card card-detail">
                        <p> Naam: <strong>${snapshot.val().name} </strong></p>
                        <p> adres: <strong>${snapshot.val().straat}, ${snapshot.val().stad}</strong></p>
                        <p> bemeubeld: <strong>${snapshot.val().bemeubeld}</strong> </p>
                        <p> Type: <strong>${snapshot.val().type}</strong> </p>
                        <p> Huurprijs: <strong>${snapshot.val().huurprijs}</strong> </p>
                        <p> Waarborg: <strong>${snapshot.val().waarborg}</strong> </p>
                      </div>
                      </div>
                      <div class="detail-text">
                        
                        <p>${detailintro}</p>
                        <p>${detailtext}</p>
                      </div>
                      <div id="map"></div>
                      </div>
                        `
                    console.log(detail)
                    document.getElementById('detail').innerHTML = detail; 
                    let loading = document.getElementById('loading');
                    loading.style.display = "none";
                    adres = snapshot.val().straat + ', ' + snapshot.val().stad;
                    console.log(adres);
                    getLongLat(adres);
                    checkliked();
                } else if(snapshot.val().kotId == id){
                  console.log(snapshot.val().huurprijs);
                    detail = "";
                    detail +=
                        `          
                        <div class="header-detail">
                          <img class="detail-img" src='../src/public/img/kot.jpg'>
                        </div>
                        <div id="card card-detail" class="card card-detail">
                          <p> Naam: <strong>${snapshot.val().name} </strong></p>
                          <p> adres: <strong>${snapshot.val().straat},${snapshot.val().stad}</strong></p>
                          <p> bemeubeld: <strong>${snapshot.val().opties}</strong> </p>
                          <p> Type: <strong>${snapshot.val().type}</strong> </p>
                          <p> Huurprijs: <strong>${snapshot.val().huurprijs}</strong> </p>
                          <p> Waarborg: <strong>${snapshot.val().waarborg}</strong> </p>
                        </div>
                        <div class="detail-text">
                          <h1>${snapshot.val().naam}</h1>
                          <p>${detailintro}</p>
                          <p>${detailtext}</p>
                        </div>
                        <div id="map"></div>
                        `
                    console.log(detail)
                    document.getElementById('detail').innerHTML = detail; 
                    let loading = document.getElementById('loading');
                    loading.style.display = "none";
                    adres = snapshot.val().straat + ', ' + snapshot.val().stad;
                    console.log(adres);
                    getLongLat(adres);
                    checkliked();
                }
            });
            
        });
    } 

    function getChatRoom(){
      console.log('chatroom');
      console.log(userId);
      console.log(kotbaasUser);
      let foundChat = null;
      firebase.database().ref('/chat').once('value').then(function(snapshots){
        snapshots.forEach(function(snapshot){
          if ( snapshot.val().user1 == userId && snapshot.val().user2 == kotbaasUser || snapshot.val().user2 == userId && snapshot.val().user1 == kotbaasUser ){
            console.log('we got the chat');
            foundChat = snapshot.val().chatId;
            window.location.replace('#/chat/' + foundChat)
            return
          }else{
            console.log('no chats found');
          }
          if(foundChat == null){
            let newChatId = '_' + Math.random().toString(36).substr(2, 9);
            foundChat = true;
            firebase.database().ref("chat/" + newChatId).set({
                user1: userId,
                user2: kotbaasUser,
                chatId: newChatId,
            });
            window.location.replace('#/chat/' + newChatId)
          }
      }) 
      if(foundChat == null){
        // als nog geen chats in de database staan
        let newChatId = '_' + Math.random().toString(36).substr(2, 9);
            foundChat = true;
            firebase.database().ref("chat/" + newChatId).set({
                user1: userId,
                user2: kotbaasUser,
                chatId: newChatId,
            });
            window.location.replace('#/chat/' + newChatId)
      } 
    }, function(error) {
      console.error(error);
      let newChatId = '_' + Math.random().toString(36).substr(2, 9);
            
            firebase.database().ref("chat/" + newChatId).set({
                user1: userId,
                user2: kotbaasUser,
                chatId: newChatId,
            });
            window.location.replace('#/chat/' + newChatId)
    })
  }

  function dislike(){
    firebase.database().ref("favorites/" + checkFavId).remove().then(function(){
      let likebtn = document.getElementById('btns');
      likebtn.style.display = "inline-block";
      let dislikebtn = document.getElementById('dislikebtn');
      dislikebtn.style.display = "none";
    })
  }

export default () => {

  update(compile(detailTemplate)());
    i = 0;
    //get id of kot by the url
    let id = window.location.href.split('/detail/')[1];
    console.log(id);
    //pass the id to the search function 
    console.log(i);
    searchKot(id);
    searchaddedkoten(id);
    update(compile(detailTemplate)());
    console.log(i);
    getUserType();
    chatbtn = document.getElementById('chatbtn');

    chatbtn.addEventListener('click',function (e) {
      e.preventDefault();
      getChatRoom();
      console.log('blute tetten');

  })
  let likebtn = document.getElementById('btns');
  likebtn.addEventListener('click',function (e) {
    e.preventDefault();
    like();
    console.log('like btn');

})
let dislikebtn = document.getElementById('dislikebtn');
dislikebtn.addEventListener('click',function (e) {
  e.preventDefault();
  dislike();
  console.log('dislike');

})



};






