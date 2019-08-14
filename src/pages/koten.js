// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

let addedkoten;
let allKoten = [];
let y = 0;
let x = 0; 
let addedkotendiv = [];
let addedkot;
let maxhuurprijs = null;
let minhuurprijs = null;
let filter = 'all';
// Import the template to use
const kotenTemplate = require('../templates/koten.handlebars');

function getAddKoten(){
    firebase.database().ref('koten/').once('value').then(function(snapshot){
        addedkoten = (snapshot.val());
        snapshot.forEach(function(childSnapshot) {
          let key = childSnapshot.key;
          let childData = childSnapshot.val();
          let childHuur = childData.huurprijs;
          console.log(key)
          console.log(childSnapshot);
          console.log(childData);
          console.log(childHuur);

          addedkotendiv +=
          `<div id="card" class="card addedkotencard${x}">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src='../src/public/img/kot.jpg'>
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${childData.name}</span>
            <p><a class="waves-effect waves-light btn" href="#/detail/${childData.kotId}" data-navigo>View</a></p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${childData.name}<i class="material-icons right">close</i></span>
            <p><p> Type: ${childData.telefoon} </p>
            <p> Type: ${childData.verdieping} </p>
            <p> Waarborg: ${childData.waarborg} </p>
            <p> Type: ${childData.type} </p></p>
          </div>
          </div>`;
          document.getElementById('addedkoten').innerHTML = addedkotendiv;

          x ++ ;
        })
        
}, function(error) {
  console.error(error);
})
}

function searching(term){
  Array.from(allKoten).forEach(function(allKot){
    const title = allKot.Naam;
    const opties = allKot.Opties;
    const type = allKot.Type;
    const waarborg = allKot.Waarborg;
    const huurprijs = allKot.Huurprijs;
    const plaats = allKot.Plaats
    console.log(title);
    let card = document.getElementsByClassName('card');
    console.log(card);
    if(title.toLowerCase().indexOf(term) != -1 || opties.toLowerCase().indexOf(term) != -1 || type.toLowerCase().indexOf(term) != -1 || huurprijs.toLowerCase().indexOf(term) != -1 || waarborg.toLowerCase().indexOf(term) != -1 || plaats.toLowerCase().indexOf(term) != -1 ){
      card[y].style.display = "block";
      console.log('correct');
    }else {
      console.log('fout');
      card[y].style.display = "none";
    }
    y ++;
  })
}

function filterKoten (filter, minhuurprijs, maxhuurprijs){
  let card = document.getElementsByClassName('card');
  let z = 0;
  Array.from(allKoten).forEach(function(allKot){
    const type = allKot.Type;
    const huurprijs = parseFloat(allKot.Huurprijs);
    console.log(minhuurprijs, maxhuurprijs);
    console.log(huurprijs);
    if(filter === 'all' && maxhuurprijs === null && minhuurprijs === null ){
        card[z].style.display = "block";
        console.log('all');
    }else if (filter === 'all'){
      if(huurprijs > minhuurprijs && huurprijs < maxhuurprijs){
        card[z].style.display = "block";
        console.log('prijs')
      }else {
        card[z].style.display = "none";
        console.log('niet prijs')
      }
    }else if (maxhuurprijs === null && minhuurprijs === null ){
      if(type.toLowerCase().indexOf(filter) != -1 ){
        card[z].style.display = "block";
        console.log(card[z]);
        console.log(type);
        console.log('correct');
      }else {
        console.log(card[z]);
        console.log(type);
        console.log('fout');
        card[z].style.display = "none";
      }
    }else if (huurprijs > minhuurprijs && huurprijs < maxhuurprijs && type.toLowerCase().indexOf(filter) != -1){
      card[z].style.display = "block";
      console.log(card[z]);
      console.log('correct');
    }else {
      console.log(card[z]);
      console.log(type);
      console.log('fout');
      card[z].style.display = "none";
    }
    z ++ ;
  })
  }

export default () => {
  // Data to be passed to the template
    const name = 'Test inc.';
    let kot;
    let total;
    let i = 0;

  // Return the compiled template to the router
    const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';
    const url2 = 'https://api.unsplash.com/search/collections?page=1&query=house';
    
    let koten = [];

    const ul = document.getElementById('koten');

    function createNode(element) {
        return document.createElement(element); // Create the type of element you pass in the parameters
      }
    
      function append(parent, el) {
        return parent.appendChild(el); // Append the second parameter(element) to the first one
      }
      

    fetch(url).then(response => {
        console.log(response)
        console.log('koten')
        return response.json()
    })
    .then( data => {

        console.log(data)
        total = data.length;
        allKoten = data;
        //console.log(data.{{first & name}});
        data.forEach(kot => {
            const { Naam , Huisummer , Plaats , Waarborg , Type , Aangemaakt , Straat , Huurprijs,} = kot
            
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
              <p><p> Huur: ${Huurprijs} </p>
              <p> adres: ${Straat} ${Huisummer}, ${Plaats}</p>
              <p> Waarborg: ${Waarborg} </p>
              <p> Type: ${Type} </p></p>
            </div>
                
                
            </div>`;
            document.getElementById('koten').innerHTML = koten;
            i ++;
        });
        getAddKoten();
        
    }).catch(error => {
        console.log('error');
        console.error(error);
    });
    console.log(total)
    update(compile(kotenTemplate)({ total }));

  const searchbar = document.getElementById('search-koten');
  searchbar.addEventListener('keyup',function(e){
  const term = e.target.value.toLowerCase();
    searching(term);
    y = 0;
})

  const filterAll = document.getElementById('filterAll');
  filterAll.addEventListener('click', function(e){
    console.log(e.target.value);
    filter = e.target.value;
  })
  const filterKamer = document.getElementById('filterKamer');
  filterKamer.addEventListener('click', function(e){
    console.log(e.target.value);
    filter = e.target.value;
  })
  const filterStudio = document.getElementById('filterStudio');
  filterStudio.addEventListener('click', function(e){
    console.log(e.target.value);
    filter = e.target.value;
  })

  const huurprijsMax = document.getElementById('huurprijsMax');
  huurprijsMax.addEventListener('keyup', function(e){
    if(e.target.value){
      maxhuurprijs = parseFloat(e.target.value);
    }else{
      maxhuurprijs = null;
    }

  })

  const huurprijsMin = document.getElementById('huurprijsMin');
  huurprijsMin.addEventListener('keyup', function(e){
    if(e.target.value){
    minhuurprijs = parseFloat(e.target.value);
    }else{
      minhuurprijs = null;
    }
  })

  const filterbtn = document.getElementById('filterbtn');
  filterbtn.addEventListener('click', function(e){
    e.preventDefault();
    console.log(filter,minhuurprijs,maxhuurprijs);
    filterKoten(filter,minhuurprijs,maxhuurprijs);
  })

  const openfilterbtn = document.getElementById('openfilterbtn');
  openfilterbtn.addEventListener('click', function(e){
    e.preventDefault();
    console.log('openfilters');
    let filters = document.getElementById('filters');
    filters.style.display = "block";
    openfilterbtn.style.display = "none";
  })

  const closefilterbtn = document.getElementById('closefilterbtn');
  closefilterbtn.addEventListener('click', function(e){
    e.preventDefault();
    console.log('closefilter');
    let filters = document.getElementById('filters');
    filters.style.display = "none";
    const openfilterbtn = document.getElementById('openfilterbtn');
    openfilterbtn.style.display = "inline-block";
  })
};
