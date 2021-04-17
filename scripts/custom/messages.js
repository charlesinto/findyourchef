const check = (val) => {
  if (val === 0) return "12";
  if (val < 10) return `0${val}`;
  return val;
};


const hoursAgo = (str) => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  const date = new Date(str);
  if (date >= yesterday) {
    if (today.getTime() - date.getTime() < 1000 * 60 * 60) {
      const mins = today.getMinutes() - date.getMinutes();
      if (mins < 2) return "1m ago";
      return mins + "m ago";
    }
    if (date.getDate() === today.getDate()) {
      const t = today.getHours() - date.getHours();
      return t + "h ago";
    }
    return today.getHours() + 24 - date.getHours() + "h ago";
  }

  return false;
};


const fetchAllMessages = () => {
  let page = 1;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));

  if (userData.role === 'chef') {
    const data = {
      chefID: userData._id
    };
    axios.post(`${baseURL}/messages/chef/recent?page=${page}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      const dashData = res.data.payload.data;
      popMessages(dashData);
      console.log(res);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  } else {
    const data = {
      userID: userData._id
    };
    axios.post(`${baseURL}/messages/user/recent?page=${page}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      const dashData = res.data.payload.data;
      popMessages(dashData);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
}

const popMessages = (dashData) => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  dashData.forEach(data => {
    console.log(data);
    const time = hoursAgo(data.created)
    const message = data.message;
    const event = window.Event;
    let chefID, userID, dName;
    if (userData._id === data.toID) {
      dName = data.fromName;
    } else {
      dName = data.toName;
    }
    if (userData.role === 'chef' && userData._id === data.toID) {
      chefID = data.toID;
      userID = data.fromID;
    } else {
      chefID = data.fromID;
      userID = data.toID;
    }

    const messageContainer = document.querySelector('.message-body');
    messageContainer.innerHTML += `<li class="unread">
    <a href="#" onclick="storeMessageData(event, '${userID}', '${chefID}')">
      <div class="message-avatar"><img src="http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70" alt="" /></div>

      <div class="message-by">
        <div class="message-by-headline">
          <h5>${dName} <i>Unread</i></h5>
          <span>${time}</span>
        </div>
        <p>${message}</p>
      </div>
    </a>
  </li>`;
  });
}

const storeMessageData = (e, userID, chefID) => {
  e.preventDefault();
  const data = {
    userID,
    chefID
  }
  console.log(data);
  sessionStorage.setItem('fyc-message', JSON.stringify(data));
  location.href='/dashboard-messages-conversation.html';
}

const fetchCurrentMessages = () => {
  const messageData = JSON.parse(sessionStorage.getItem('fyc-message'));
  console.log(messageData);
  const chefID = messageData.chefID;
  const userID = messageData.userID;
  const data = {
    userID,
    chefID
  }
  let page = 1;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  axios.post(`${baseURL}/messages?page=${page}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    const messages = res.data.payload.data;
    console.log(res);
    popChats(messages);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const popChats = (messages) => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  console.log(messages);
  const messageContainer = document.querySelector('.message-container');
  document.querySelector('.messages-headline').innerHTML = `<h4>${messages[0].fromName}</h4>`;
  messages.forEach(data => {
    const pic = data.fromImage;
    const text = data.message;
    const created = data.created;
    let d = new Date(created);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const time = check(hours % 12) + ":" + check(minutes) + `${hours >= 12 ? " PM" : " AM"}`;
    
    if (userData.role === data.from) {
      messageContainer.innerHTML += `<div class="message-bubble me">
      <div class="message-avatar"><img src="${pic}" alt="" /></div>
      <div class="message-text"><p>${text}</p><span>${time}</span></div>
    </div>`;
    } else {
      messageContainer.innerHTML += `<div class="message-bubble">
      <div class="message-avatar"><img src="${pic}" alt="" /></div>
      <div class="message-text"><p>${text}</p><span>${time}</span></div>
    </div>`;
    }
  })
}