const userData = sessionStorage.getItem('fyc-user') || localStorage.getItem('fyc-user');
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
        console.log("The err is ", err)
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
    const messageData = JSON.parse(sessionStorage.getItem('fyc-message'));
    let message = document.querySelector('#message');
    const data = {
      userID: messageData.userID,
      message: message.value
    }
    socketChef.emit('chef/message', data);
    console.log("Sending a message.....", data);
    popMessage(message.value);
    message.value = "";
  }

  const replyMessage = () => {
    const messageData = JSON.parse(sessionStorage.getItem('fyc-message'));
    let message = document.querySelector("#message");
    const data = {
      message: message.value,
      chefID: messageData.chefID
    };
    socketUser.emit('user/message', data);
    console.log("Sending a message.....");
    popMessage(message.value);
    message.value = "";
  }

  const popMessage = (message) => {
    let d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const time = check(hours % 12) + ":" + check(minutes) + `${hours >= 12 ? " PM" : " AM"}`;
    
    const messageContainer = document.querySelector('.message-container');
    messageContainer.innerHTML += `<div class="message-bubble me">
      <div class="message-avatar"><img src="${userData.image}" alt="" /></div>
      <div class="message-text"><p>${message}</p><span>${time}</span></div>
    </div>`;

  }

  const addMessage = (role, data) => {
    let d = new Date(created);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const time = check(hours % 12) + ":" + check(minutes) + `${hours >= 12 ? " PM" : " AM"}`;
    
    console.log(data);
    const messageContainer = document.querySelector('.message-container');
    const message = data.payload.message;
    if (role === 'chef') {
      const image = data.payload.chefData.image;
      messageContainer.innerHTML += `<div class="message-bubble">
        <div class="message-avatar"><img src="${image}" alt="" /></div>
        <div class="message-text"><p>${message}</p><span>${time}</span></div>
      </div>`;
    } else {
      const image = data.payload.userData.image;
      messageContainer.innerHTML += `<div class="message-bubble">
        <div class="message-avatar"><img src="${image}" alt="" /></div>
        <div class="message-text"><p>${message}</p><span>${time}</span></div>
      </div>`;
    }
  }