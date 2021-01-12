// Toggle password visibility
const passwordToggle = document.querySelector('.toggle-password');
if (passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const icon = document.querySelector('.toggle-password i');
    const password = document.querySelector('#password1');
    if (icon.classList.contains('fa-eye-slash')) {
      icon.className = 'fa fa-eye';
      password.setAttribute('type', 'password');
      passwordToggle.setAttribute('title', 'View password');
    } else {
      password.setAttribute('type', 'text');
      passwordToggle.setAttribute('title', 'Hide password');
      icon.className = 'fa fa-eye-slash';
    }
  })
}

const baseURL = 'https://thepotters-api.herokuapp.com/api/v1';

const handleLogin = (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const button = document.querySelector('#login-btn');
  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);

  const data = {
    email,
    password
  }
  axios.post(`${baseURL}/login`, data).then(({ data }) => {
    console.log(data);
    button.innerHTML = 'Login';
    button.removeAttribute('disabled');
    const rememberMe = document.querySelector('#remember-me');
    if (rememberMe.checked) {
      localStorage.setItem('fyc-token', data.payload.token);
      localStorage.setItem('fyc-user', JSON.stringify(data.payload.data));
    } else {
      sessionStorage.setItem('fyc-token', data.payload.token);
      sessionStorage.setItem('fyc-user', JSON.stringify(data.payload.data));
    }
    location.href = '/dashboard.html';
  }).catch((err) => {
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
    console.log(err.response);
    button.innerHTML = 'Login';
  });
}

const sendOTP = (email, user) => {
  localStorage.setItem('fyc-email', email);
  const data = {
    email
  };
  // $.magnificPopup.open({
  //   items: {
  //     src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
  //     type: 'inline'
  //   }
  // });
  // document.querySelector('#otp').focus();
  axios.post(`${baseURL}/${user}/verify-number/request`, data).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const verifyOTP = (e, user) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value
  }
  localStorage.removeItem('fyc-email');
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/${user}/verify-number`, data).then((res) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    toastr.success('OTP verification successful');
    location.href = '/login.html';
  }).catch((err) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const handleSignup = (e, user) => {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email2').value;
  const username = document.querySelector('#username2').value;
  const password = document.querySelector('#password1').value;
  const phoneNumber = document.querySelector('#number').value;
  const button = document.querySelector('#signup-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);

  const data = {
    fullname: name,
    username,
    email,
    password,
    phoneNumber
    // phoneNumber: new libphonenumber.parsePhoneNumber(phone).number
  }
  axios.post(`${baseURL}/signup/${user}`, data).then((res) => {
    console.log(res);
    sendOTP(email, user);
    // verifyOTP(e, user);
    button.innerHTML = 'Register';
    button.removeAttribute('disabled');
  }).catch((err) => {
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
    console.log(err.response);
    button.innerHTML = 'Register';
  });
}

const handleUserSignup = (e, person) => {
  handleSignup(e, person)
}
const handleChefSignup = (e, person) => {
  handleSignup(e, person)
}


/*(function() {
  const element = document.getElementById("passbase-button")
  const apiKey = "LzvZi2zh1EZ0gYWhkOjW6PLYbEQPvtE7thucHOBxkdX82YEcT3aV9uDUqzhmT7oM"
  const button = document.querySelector('#signup-btn');
  const email = document.querySelector('#email2').value;
  
  Passbase.renderButton(element, apiKey, {
    onFinish: (identityAccessKey) => {
      const data = {
        email,
        key: String(identityAccessKey)
      }
      console.log("identityAccessKey is => ", identityAccessKey, typeof(identityAccessKey));
      axios.post(`${baseURL}/chef/verify-key`, data).then((res) => {
        // button.innerHTML = 'Verify';
        button.removeAttribute('disabled');
        // toastr.success('OTP verification successful');
        // location.href = '/login.html';
        console.log(res);
      }).catch((err) => {
        // button.innerHTML = 'Verify';
        // button.removeAttribute('disabled');
        // if (err.response && err.response.data) {
        //   toastr.error(err.response.data.error.message);
        // } else {
        //   toastr.error('Something went wrong, please try again');
        // }
      });
    },
    onError: (errorCode) => {
      console.log("an error occured => ", errorCode);
    },
    onStart: () => {
      console.log("Verification Starting...");
      button.setAttribute('disabled', true);
    }
  }) 
})();*/