// // import { socketChef, socketUser } from '/index.js';

// // const {socketChef} = require("./index")
// import x from "./test.js";

// console.log(x);

// const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
// const jwt = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
// if (userData.role === 'chef') {
//   let socketChef = io.connect(`https://thepotters-api.herokuapp.com/chef`, {
//     query: `token=${jwt}`,
//   });
  
//   // Listen to this response event to know when your message has been replied
//   socketChef.on('user/message', (data) => {
//     console.log('New message gotten from user => ', data);
//   });
  
//   // Send message to user
//   function sendMessage(){
//     const message = document.querySelector('#message').value;
//     const data = {
//       userID: "5fdeaad39ead87b3ff03f558",
//       message,
//     }
//     socketChef.emit('chef/message', data);
//     console.log("Sending a message.....", data);
//   }

// } else {
//   let socketUser = io.connect(`https://thepotters-api.herokuapp.com/user`, {
//     query: `token=${jwt}`,
//   });

//   // Reply message from a chat received
//   function replyMessage(){
//     const message = document.querySelector("#message").value;
//     socketUser.emit('user/message', {
//       message,
//       chefID: "5ffb82ec0a382828795b050a"
//     });
//     console.log("Sending a message.....");
//   }

//   // When a chat message comes in
//   socketUser.on('chef/message', (data) => {
//     console.log("New message => ", data);
//   })

//   // socket.emit('message', "Hellooooooo");

//   // socket.on('reply', (data) => {
//   // 	console.log("Message => ", data);
//   // })
// }
// // export default socketChef;

// const jwt = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
// let socketUser = io.connect(`https://thepotters-api.herokuapp.com/user`, {
//   query: `token=${jwt}`,
// });
const chefID = sessionStorage.getItem('fyc-recipe-chefID');

// Reply message from a chat received
const sendChefMessage = () => {
  let message = document.querySelector("#message");
  socketUser.emit('user/message', {
    message: message.value,
    chefID
  });
  console.log("Sending a message.....");
  toastr.success('Sending message');
  message.value = "";
}
