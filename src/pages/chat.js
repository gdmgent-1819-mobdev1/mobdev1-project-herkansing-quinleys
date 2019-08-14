// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const chatTemplate = require('../templates/chat.handlebars');
let userId;
let user2Id = 'userId2';
let chatID;
let otherUser;
let username;
function getUserId() {
    userId = firebase.auth().currentUser.uid;
    console.log(userId)
    console.log(chatID);
    getUsername();
}
function getUsername() {
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        username = "";
        username = snapshot.val().username;
    }, function(error) {
  console.error(error);
})
}
/*
function getChatId() {
    firebase.database().ref('chat/').once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.val());
            let childData = childSnapshot.val();
            if(userId == childData.user1 && user2Id == childData.user2 || userId == childData.user2 && user2Id == childData.user1){
                console.log('deze chat');
                chatId = childData.chatId;
                console.log(chatId);
                if(userId == childData.user1){
                    otherUser = childData.user2;
                    console.log(otherUser);
                }else{
                    otherUser = childData.user1
                    console.log(otherUser);
                }
            }else {
                console.log('niet deze chat');
            }
        })
        
}, function(error) {
  console.error(error);
})
}
*/
export default () => {

chatID = window.location.href.split('/chat/')[1];
  getUserId();
  //getChatId();

  // Return the compiled template to the router
  update(compile(chatTemplate)());
  console.log(otherUser);

  const messageScreen = document.getElementById('messages');
  const msgInput = document.getElementById('msg-input');
    const msgBtn = document.getElementById('msg-btn');
    const messageForm = document.getElementById('messageForm');
    const db = firebase.database();
    const chatRef = db.ref('/chat/');
    const msgRef = db.ref('/msgs/' + chatID );
    
    messageForm.addEventListener("submit", event => {

        event.preventDefault();
        
        const text = msgInput.value;
        /*
        //if(!text.value) return;
        const newChat = {
            user1: userId,
            user2: 'userId2',
            chatId: chatID,
        }
        */
        const msg = {
            id: userId,
            name: username,
            text: text,
            chatId: chatID,
        };

        let newChatId = '_' + Math.random().toString(36).substr(2, 9);
        /*
        db.ref("chat/" + newChatId).set({
            user1: userId,
            user2: 'userId2',
            chatId: newChatId,
        });
        */
        msgRef.push(msg);
        msgInput.value='';
        console.log(chatID);
    })

    const updateMsges = data => {
        const { id, name, text } = data.val();
        console.log(id, name, text);
        const msg = `
        <li class="msg ${id == userId && "my"}">
            <span class="black-text">
            <i class="name">${name}: </i> ${text}
            </span>
        </li>
        `
        ;
        messageScreen.innerHTML += msg;
        //console.log(data.val());
    }

    msgRef.on('child_added', updateMsges);
};
