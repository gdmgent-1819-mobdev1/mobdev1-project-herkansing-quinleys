// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
// Firebase
const { getInstance } = require('../firebase/firebase');
const firebase = getInstance();
// Import the template to use
const chatoverviewTemplate = require('../templates/chatoverview.handlebars');
let userId;
let myChats;
let y;
let seconduser;
let secondusername;
function getUserId(){
    userId = firebase.auth().currentUser.uid;
    console.log(userId);
    getAllChats();
}

function getAllChats(){
    firebase.database().ref('chat/').once('value').then(function(snapshots){
        myChats = '';
        snapshots.forEach(function(childSnapshot) {
            console.log(childSnapshot.val());
            let childData = childSnapshot.val();
            if(userId == childData.user1 || userId == childData.user2){
                if(childData.user1 == userId){
                    seconduser = childData.user2
                    console.log(seconduser);
                }else{
                    seconduser = childData.user1
                    console.log(seconduser);
                }
                firebase.database().ref('/users/' + seconduser).once('value').then(function(snapshot) {
                    secondusername = snapshot.val().username;
                    console.log(secondusername);
                    if(secondusername != undefined ){
                        console.log('dit is een chat');
                        console.log(secondusername);
                    myChats +=
                    `
                    <tr>
                        <td>${secondusername}</td>
                        <td>Last Message</td>
                        <td><a class="waves-effect waves-light btn" href="#/chat/${childData.chatId}" data-navigo>View</a></td>
                    </tr>
                    `
                    }
                    
                    document.getElementById('chats').innerHTML = myChats; 
                })
                
            }else {
                console.log('niet deze chat');
            }
        })
        
}, function(error) {
  console.error(error);
})
}


export default () => {
  // Data to be passed to the template
    getUserId();
    
  // Return the compiled template to the router
  update(compile(chatoverviewTemplate)());

};
