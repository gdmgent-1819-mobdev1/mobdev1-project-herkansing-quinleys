// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';``

const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();
// Import the template to use
const editkotTemplate = require('../templates/editkot.handlebars');
let trueid;
let detail;

function getEditKot(){
    return firebase.database().ref('/koten/').once('value')
        .then(function(snapshots){
          console.log('inside')
            snapshots.forEach(function(snapshot){
                if(snapshot.val().kotId == trueid){
                    console.log(snapshot.val().huurprijs);
                    detail = "";
                    detail +=
                        `          
                        <div class="body">
                        <h1>Edit Kot</h1>
                        <form class="edit">
                            <label>Naam</label>
                            <input type="text" class="name" value="${snapshot.val().name}">
                            <label>Huurprijs</label>
                            <input type="number" class="huurprijs" value="${snapshot.val().huurprijs}">
                            <label>Telefoonnummer</label>
                            <input type="number" class="telefoon" value="${snapshot.val().telefoon}">
                            <label>Waarborg</label>
                            <input type="text" class="waarborg" value="${snapshot.val().waarborg}">
                            <label>Straat</label>
                            <input type="text" class="straat" value="${snapshot.val().straat}">
                            <label>Stad</label>
                            <input type="text" class="stad" value="${snapshot.val().stad}">
                            <label>PostCode</label>
                            <input type="number" class="postcode" value="${snapshot.val().postcode}">
                            <label>Oppervlakte</label>
                            <input type="number" class="oppervlakte" value="${snapshot.val().oppervlakte}">
                            <label>Verdieping</label>
                            <input type="number" class="verdieping" value="${snapshot.val().verdieping}">
                            <label>Type</label>
                            <select class="browser-default type" value="${snapshot.val().type}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="kamer">Kamer</option>
                                <option value="studio">Studio</option>
                                <option value="anders">Anders</option>
                            </select>
                            <label>Aantal Personen</label>
                            <select class="browser-default aantalpersonen" value="${snapshot.val().aantalpersonen}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="1-2">1-2</option>
                                <option value="3-4">3-4</option>
                                <option value="meer dan 5">meer dan 5</option>
                            </select>
                            <label>Toilet</label>
                            <select class="browser-default toilet" value="${snapshot.val().toilet}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="prive">Prive</option>
                                <option value="gedeeld">Gedeeld</option>
                                <option value="niet aanwezig">Niet aanwezig</option>
                            </select>
                                
                            <label>Douche</label>
                            <select class="browser-default douche" value="${snapshot.val().douche}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="prive">Prive</option>
                                <option value="gedeeld">Gedeeld</option>
                                <option value="niet aanwezig">Niet aanwezig</option>
                            </select>

                                <label>Bad</label>
                            <select class="browser-default bad" value="${snapshot.val().bad}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="prive">Prive</option>
                                <option value="gedeeld">Gedeeld</option>
                                <option value="niet aanwezig">Niet aanwezig</option>
                                </select>

                            <label>Keuken</label>
                            <select class="browser-default keuken" value="${snapshot.val().keuken}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="prive">Prive</option>
                                <option value="gedeeld">Gedeeld</option>
                                <option value="niet aanwezig">Niet aanwezig</option>
                                </select>

                                <label>Bemeubeld</label>
                                <select class="browser-default bemeubeld" value="${snapshot.val().bemeubeld}">
                                <option value="" disabled selected>Choose your option</option>
                                <option value="ja">ja</option>
                                <option value="nee">nee</option>
                                </select>
                            <label>Info</label>
                            <textarea class="info" value="${snapshot.val().info}"></textarea>
                        </form>
                    </div>
                        `
                    console.log(detail);
                    console.log(snapshot.val().name);
                    document.getElementById('editform').innerHTML = detail;
                    }
            })
        }).catch(error => {
            console.log('error');
            console.error(error);
            //searchaddedkoten(id);
          });
    }  

function editForm(){

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

    firebase.database().ref('koten/' + trueid).update({
        name: name.value,
        huurprijs: huurprijs.value,
        telefoon: telefoon.value,
        waarborg: waarborg.value,
        straat: straat.value,
        stad: stad.value,
        postcode: postcode.value,
        info: info.value,
        type: type.value,
        verdieping:verdieping.value,
        aantalpersonen: aantalpersonen.value,
        toilet: toilet.value,
        douche: douche.value,
        bad: bad.value,
        keuken: keuken.value,
        bemeubeld: bemeubeld.value,

    })
    window.location.replace('#/detail/' + trueid);
}

export default () => {
  // Data to be passed to the template
  let id = window.location.href.split('/detail/')[1];
  trueid = id.split('/edit')[0];
  getEditKot();
  console.log(trueid);
  // Return the compiled template to the router
  update(compile(editkotTemplate)());
  let editbtn = document.getElementById('editbtn');
  editbtn.addEventListener('click', function(e){
      console.log('edit')
      editForm();
  })
};
