
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const jwt = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  let socketChef, socketUser;
  if (jwt) {
    if (userData.role === 'chef') {
      socketChef = io.connect(`https://thepotters-api.herokuapp.com/chef`, {
        query: `token=${jwt}`,
      });
      // You can only emit events to this socketChef "successfully" after it has been authenticated
      socketChef.on('authenticated', (msg) => {
        console.log("The connection was successful => ", msg);
      })

      // Listen to authentication errors
      socketChef.on("error", (err) => {
        console.log("The error is ", err);
        toastr.error(err);
      })

      // Listen to all other errors on this socketChef, see documentation for error and success formats
      socketChef.on("err", (err) => {
        console.log("The err is ", err);
        toastr.error(err);
      })

      
      // Listen to this response event to know when your message has been replied
      socketChef.on('user/message', (data) => {
        console.log('New message gotten from user => ', data);
        toastr.success('New message');
        const role = 'user';
        addMessage(role, data);        
      });
      
    } else {
      socketUser = io.connect(`https://thepotters-api.herokuapp.com/user`, {
        query: `token=${jwt}`,
      });

      // You can only emit events to this socketUser "successfully" after it has been authenticated
      socketUser.on('authenticated', (msg) => {
        console.log("The connection was successful => ", msg);
      })

      // Listen to authentication errors
      socketUser.on("error", (err) => {
        console.log("The error is ", err);
      })

      // Listen to all other errors on this socketUser, see documentation for error and success formats
      socketUser.on("err", (err) => {
        console.log("The err is ", err);
      })

      // When a chat message comes in
      socketUser.on('chef/message', (data) => {
        console.log("New message => ", data);
        toastr.success('New message');
        const role = 'chef';
        addMessage(role, data);
      })
    }
  }

  const checkSocket = () => {
    if (userData.role === 'chef') {
      sendMessage();
    } else {
      replyMessage();
    }
  }

  const sendMessage = () => {
    let message = document.querySelector('#message');
    const data = {
      userID: "602a48f4ad93cd0017a1c60a",
      message: message.value
    }
    socketChef.emit('chef/message', data);
    console.log("Sending a message.....", data);
    popMessage(message.value);
    message.value = "";
  }

  const replyMessage = () => {
    let message = document.querySelector("#message");
    const data = {
      message: message.value,
      chefID: "60298fd861bf100017f70d55"
    };
    socketUser.emit('user/message', data);
    console.log("Sending a message.....");
    popMessage(message.value);
    message.value = "";
  }

  const popMessage = (message) => {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.innerHTML += `<div class="message-bubble me">
      <div class="message-avatar"><img src="http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70" alt="" /></div>
      <div class="message-text"><p>${message}</p></div>
    </div>`;

  }

  const addMessage = (role, data) => {
    console.log(data);
    const messageContainer = document.querySelector('.message-container');
    const message = data.payload.message;
    if (role === 'chef') {
      const image = data.payload.chefData.image;
      messageContainer.innerHTML += `<div class="message-bubble">
        <div class="message-avatar"><img src="${image}" alt="" /></div>
        <div class="message-text"><p>${message}</p></div>
      </div>`;
    } else {
      const image = data.payload.userData.image;
      messageContainer.innerHTML += `<div class="message-bubble">
        <div class="message-avatar"><img src="${image}" alt="" /></div>
        <div class="message-text"><p>${message}</p></div>
      </div>`;
    }
  }