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
// const axios = require('axios');

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

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  location.href = "/login.html";
}

const sendOTP = (email) => {
  localStorage.setItem('fyc-email', email);
  const data = {
    email
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/user/verify-number/request`, data).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const sendChefOTP = (e) => {
  e.preventDefault();
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    email: userData.email,
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/chef/verify-number/request`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const verifyOTP = (e) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value
  }
  console.log(data);
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/user/verify-number`, data).then((res) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    console.log(res);
    toastr.success('OTP verification successful');
    fetchChefData();
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

const verifyChefOTP = (e) => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const data = {
    email: userData.email,
    otp: document.querySelector('#otp').value
  }
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/chef/verify-number`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    button.innerHTML = 'Verify';
    button.removeAttribute('disabled');
    toastr.success('Phone number verification successful');
    handleLogout();
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

const fetchChefData = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const id = userData._id;
  axios.get(`${baseURL}/chefs/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    // if (sessionStorage.getItem('fyc-user')) {
    //   sessionStorage.removeItem('fyc-user');
    // } else {
    //   localStorage.removeItem('fyc-user');
    // }
    const newData = res.data.payload.data;
    console.log(newData);
    sessionStorage.setItem('fyc-user', JSON.stringify(newData));
    location.reload();
  }).catch((err) => {
    console.log(err);
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const fetchUserData = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const id = userData._id;
  axios.get(`${baseURL}/user/overview/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    // if (sessionStorage.getItem('fyc-user')) {
    //   sessionStorage.removeItem('fyc-user');
    // } else {
    //   localStorage.removeItem('fyc-user');
    // }
    const newData = res.data.payload.data.data;
    console.log(newData);
    sessionStorage.setItem('fyc-user', JSON.stringify(newData));
    location.reload();
  }).catch((err) => {
    console.log(err);
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}


const resetOTP = (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  localStorage.setItem('fyc-email', email);
  const data = {
    email
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  document.querySelector('#otp').focus();
  axios.post(`${baseURL}/request-verification`, data).then((res) => {
    console.log(res);
    toastr.success('OTP verification sent');
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}


const verifypasswordOTP = (e) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value,
    password: document.querySelector('#password').value
  }
  localStorage.removeItem('fyc-email');
  e.preventDefault();
  const button = document.querySelector('#otp-btn');
  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/reset-password`, data).then((res) => {
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


const handleUserSignup = (e) => {
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
  axios.post(`${baseURL}/signup/user`, data).then((res) => {
    console.log(res);
    sendOTP(email);
    button.innerHTML = 'Register';
    button.removeAttribute('disabled');
    // location.href = '/login.html';
    // form.classList.add('display-none');
    // message.classList.remove('display-none');
  }).catch((err) => {
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
      console.log(err.response);
    } else {
      toastr.error('Something went wrong, please try again');
    }
    button.innerHTML = 'Register';
  });
}

const handleChefSignup = (e, user) => {
  // handleSignup(e, person)
  e.preventDefault();
  let name = document.querySelector('#name').value;
  let email = document.querySelector('#email2').value;
  let username = document.querySelector('#username2').value;
  let password = document.querySelector('#password1').value;
  let phoneNumber = document.querySelector('#number').value;
  let button = document.querySelector('#signup-btn');
  let form = document.querySelector('.sign-up-form');
  let message = document.querySelector('.success-message');

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
    // sendOTP(email, user);
    // verifyOTP(e, user);
    // button.innerHTML = 'Register';
    // button.removeAttribute('disabled');
    // location.href = '/login.html';
    localStorage.setItem('fyc-email', email);
    form.classList.add('display-none');
    message.classList.remove('display-none');
    name = '';
    email = '';
    username = '';
    phoneNumber = '';
    
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

// ADD NEW RECIPE

const addListingSection = document.querySelector('#add-listing');
if (addListingSection) {
  addListingSection.addEventListener('click', (e) => {
    if (e.target.id === 'post-recipe') {
      e.preventDefault();
      e.target.innerHTML = '<div class="loader"></div>';
      e.target.setAttribute('disabled', true);
      let name = document.querySelector('#recipe-title');
      let category = document.querySelector('#category');
      let keywords = document.querySelector('#keywords');
      let tags = keywords.value.split(',');
      let overview = document.querySelector('#summary');
      let perimeter = ["1.02433,0.84950", "2.4923,1.490493"];
      let priceVal = document.querySelector('.default-price');
      let price = parseInt(priceVal.value);
      const pricingTable = document.querySelector('.ui-sortable').children;
      let priceShow = [];
      let pricing = [];
      Array.prototype.forEach.call(pricingTable, function(tab) {
        if(tab.children.length != 0) {
          priceShow.push(tab.children);
        }
      })
      priceShow.forEach( price => {
        if (price[0].children[0].children[0].value != "" &&
            price[0].children[1].children[0].value != "" &&
            price[0].children[2].children[1].value != "") {
              pricing.push({
                "title" : price[0].children[0].children[0].value,
                "description" : price[0].children[1].children[0].value,
                "price" : parseInt(price[0].children[2].children[1].value)
              })
            } else {
              false;
            }
        console.log(pricing);
      })
      const data = {
        name: name.value,
        overview: overview.value,
        category: category.value,
        perimeter,
        tags,
        price,
        pricing
      }
      console.log(data);
      const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
      axios.post(`${baseURL}/chef/recipe`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        e.target.removeAttribute('disabled');
        e.target.innerHTML = 'Post Recipe <i class="fa fa-arrow-circle-right"></i>';
        console.log(res);
        name.value = "";
        overview.value = "";
        category.value = "";
        priceVal.value = "";
        keywords.value = "";
        toastr.success('Recipe added successfully!');
      }).catch((err) => {
        e.target.removeAttribute('disabled');
        e.target.innerHTML = 'Post Recipe <i class="fa fa-arrow-circle-right"></i>';
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    }
  })
}

const setCategory = () => {
  const categoryParent = document.querySelector('#category');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const selectedCat = userData.categories;
  selectedCat.forEach( cat => {
    categoryParent.innerHTML += `<option value="${cat}">${cat}</option>`;
  })
}

/* PASSBASE VERIFICATION */
const element = document.getElementById("passbase-button")
if(element) {
  const apiKey = "LzvZi2zh1EZ0gYWhkOjW6PLYbEQPvtE7thucHOBxkdX82YEcT3aV9uDUqzhmT7oM"
  // const button = document.querySelector('#signup-btn');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const email = userData.email;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  
  Passbase.renderButton(element, apiKey, {
    onFinish: (identityAccessKey) => {
      const data = {
        email,
        key: identityAccessKey,
      }
      console.log("identityAccessKey is => ", identityAccessKey, typeof(identityAccessKey));
      axios.post(`${baseURL}/chef/verify-key`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        // button.innerHTML = 'Verify';
        button.removeAttribute('disabled');
        // toastr.success('OTP verification successful');
        // location.href = '/login.html';
        console.log(res);
      }).catch((err) => {
        // button.innerHTML = 'Verify';
        // button.removeAttribute('disabled');
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    },
    onError: (errorCode) => {
      console.log("an error occured => ", errorCode);
    },
    onStart: () => {
      console.log("Verification Starting...");
      console.log(axios);

      // button.setAttribute('disabled', true);
    }
  }) 
}

/* DASHBOARD ACCOUNT VERIFICATION */

/* SHOW USER'S NAME WHEN THEY LOGIN */

const username = document.querySelector('.logged-username');
if (username) {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const user = userData.username;
  let image;
  if (userData.role == "chef") {
    image = userData.profilePic;
  } else {
    image = userData.image;
  }
  username.innerHTML = `<span><img src="${image}" alt=""></span>Hi, ${user}!`;
}
const headername = document.querySelector('.header-name');
if (headername) {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const user = userData.username;
  headername.innerHTML = `Howdy, ${user}!`;
}

/* GET RECIPE */
const loadActiveRecipe = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const chefID = userData._id;
  const pagination = document.querySelector('.recipe-pagination');
  let page = 1;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    chefID,
  };
  axios.post(`${baseURL}/chef/recipe/list?status=active&page=${page}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const recipes = res.data.payload.data.data;
    const recipeCount = res.data.payload.data.total;
    popRecipe(recipes);
    paginate(recipeCount);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  pagination.addEventListener('click', (e) => {
    const listingParent = document.querySelector('.dashboard-content');
    listingParent.scrollIntoView({ behavior: 'smooth', block: 'start'});
    const pageParent = e.target.parentElement.parentElement.children;
    e.preventDefault();
    if (e.target.classList.contains("next")) {
      page;
      let curPage,nxtPage;
      for (let i = 0; i < pageParent.length; i++) {
        const pageNode = pageParent[i].children[0];
        if (pageNode.classList.contains('current-page')) {
          curPage = i;
          const prevPage = parseFloat(pageNode.innerText);
          page = prevPage + 1;
        } else {
          false;
        }
      }
      nxtPage = curPage + 1;
      pageParent[curPage].children[0].classList.remove('current-page');
      pageParent[nxtPage].children[0].classList.add('current-page');
      axios.post(`${baseURL}/chef/recipe/list?status=active&page=${page}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        console.log(res.data.payload.data);
        const recipes = res.data.payload.data.data;
        popRecipe(recipes);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    } else {
      for (let i = 0; i < pageParent.length; i++) {
        const pageNode = pageParent[i].children[0];
        if (pageNode.classList.contains('current-page')) {
          pageNode.classList.remove('current-page');
        } else {
          false;
        }
      }
      page = e.target.innerText;
      e.target.classList.add('current-page');
      axios.post(`${baseURL}/chef/recipe/list?status=active&page=${page}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        const recipes = res.data.payload.data.data;
        popRecipe(recipes);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    }
  })
};

const paginate = (count) => {
  const pageContainer = document.querySelector('.recipe-pagination');
  pageContainer.innerHTML = `<li><a href="#" class="current-page">1</a></li>`;
  const pages = Math.ceil(count / 10);
  for (let i = 2; i <= pages; i++) {
    pageContainer.innerHTML += `<li><a href="#">${i}</a></li>`;
  }
  pageContainer.innerHTML += `<li><a class="next" href="#"><i id="next" class="next sl sl-icon-arrow-right"></i></a></li>`;
}

const popRecipe = (recipes) => {
  const listParent = document.querySelector('#recipe-list');
  listParent.innerHTML = "";
  recipes.forEach(recipe => {
    console.log(recipe);
    const name = recipe.name;
    const location = recipe.location;
    const image = recipe.image;
    const recipeID = recipe._id;
    const chefID = recipe.chefID
    const event = window.Event;
    let list = `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3><a href="#">${name}</a></h3>
            <span>${location}</span>
            <!--<div class="star-rating" data-rating="5">
              <div class="rating-counter">(12 reviews)</div>
            </div>-->
          </div>
        </div>
      </div>
      <div class="buttons-to-right">
        <div onclick="saveRecipe(event, ${JSON.stringify(recipe).split('"').join("&quot;")})" class="edit-recipe"><a href="#" class="button gray"><i class="sl sl-icon-note"></i> Edit</a></div>
        <div onclick="deleteRecipe(event, '${chefID}', '${recipeID}')" class="delete-recipe"><a href="#" class="button gray"><i class="sl sl-icon-close"></i> Delete</a></div>
      </div>
    </li>
    `;
    listParent.innerHTML += list;
  });
}

/* DELETE RECIPE */
  const deleteRecipe = (event, chefID, recipeID) => {
    event.preventDefault();
    const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
    const data = {
      recipeID,
      chefID
    };
    const actionBtn = event.target.parentElement;
    actionBtn.parentElement.parentElement.remove();
    axios.delete(`${baseURL}/chef/recipe`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }, data).then((res) => {
      console.log(res);
      toastr.success(res.data.payload.data.message);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });      
  }

/* EDIT RECIPE */
const saveRecipe = (e, recipe) => {
  e.preventDefault();
  // console.log(recipe);
  sessionStorage.setItem('fyc-single-recipe', JSON.stringify(recipe));
  location.href='/dashboard-edit-recipe.html';
}
/* GET RECIPE */
const loadExpiredRecipe = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const chefID = userData._id;
  const pagination = document.querySelector('.recipe-pagination');
  let page = 1;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    chefID,
  };
  axios.post(`${baseURL}/chef/recipe/list?status=expired&page=${page}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const recipes = res.data.payload.data.data;
    const recipeCount = res.data.payload.data.total;
    popDelRecipe(recipes);
    paginate(recipeCount);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  pagination.addEventListener('click', (e) => {
    const listingParent = document.querySelector('.dashboard-content');
    listingParent.scrollIntoView({ behavior: 'smooth', block: 'start'});
    const pageParent = e.target.parentElement.parentElement.children;
    e.preventDefault();
    if (e.target.classList.contains("next")) {
      page;
      let curPage,nxtPage;
      for (let i = 0; i < pageParent.length; i++) {
        const pageNode = pageParent[i].children[0];
        if (pageNode.classList.contains('current-page')) {
          curPage = i;
          const prevPage = parseFloat(pageNode.innerText);
          page = prevPage + 1;
        } else {
          false;
        }
      }
      nxtPage = curPage + 1;
      pageParent[curPage].children[0].classList.remove('current-page');
      pageParent[nxtPage].children[0].classList.add('current-page');
      axios.post(`${baseURL}/chef/recipe/list?status=expired&page=${page}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        console.log(res.data.payload.data);
        const recipes = res.data.payload.data.data;
        popDelRecipe(recipes);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    } else {
      for (let i = 0; i < pageParent.length; i++) {
        const pageNode = pageParent[i].children[0];
        if (pageNode.classList.contains('current-page')) {
          pageNode.classList.remove('current-page');
        } else {
          false;
        }
      }
      page = e.target.innerText;
      e.target.classList.add('current-page');
      axios.post(`${baseURL}/chef/recipe/list?status=expired&page=${page}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        const recipes = res.data.payload.data.data;
        popDelRecipe(recipes);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    }
  })
};
const popDelRecipe = (recipes) => {
  const listParent = document.querySelector('#recipe-list');
  listParent.innerHTML = "";
  recipes.forEach(recipe => {
    const name = recipe.name;
    const location = recipe.location;
    const image = recipe.image;
    const recipeID = recipe._id;
    const chefID = recipe.chefID
    const event = window.Event;
    let list = `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3><a href="#">${name}</a></h3>
            <span>${location}</span>
            <!--<div class="star-rating" data-rating="5">
              <div class="rating-counter">(12 reviews)</div>
            </div>-->
          </div>
        </div>
      </div>
    </li>
    `;
    listParent.innerHTML += list;
  });
  
/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }

    });

  } starRating('.star-rating');

}

/* REMOVE SIGN IN BUTTON IF THE USER IS SIGNED IN */

adjacentElement = document.querySelector('.with-icon');
if (adjacentElement) {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  let targetElement = document.createElement('a');
  if (token) {
    // targetElement = `<a href="dashboard.html"><i class="sl sl-icon-settings"></i> Dashboard</a>`;
    targetElement.href = "dashboard.html";
    targetElement.classList.add('dynamic-dashboard');
    targetElement.innerHTML = '<i class="sl sl-icon-settings"></i> Dashboard';
  } else {
    // targetElement = `<a href="login.html" class="sign-in popup-with-zoom-anim"><i class="sl sl-icon-login"></i> Sign In</a>`;
    targetElement.href = "login.html";
    targetElement.classList.add('sign-in');
    targetElement.innerHTML = '<i class="sl sl-icon-login"></i> Sign In';
  }
  adjacentElement.insertAdjacentElement('beforebegin', targetElement);
}


const tagCon = document.querySelector('.highlighted-categories');
if (tagCon) {
  let tag;
  tagCon.addEventListener('click', (e) => {
    e.preventDefault();
    const category = e.target.dataset.category;
    sessionStorage.setItem('fyc-data-category', category);
  })
}

/*SEARCH QUERY ON HOME PAGE TO FIND CHEF IN EXPLORE PAGE */
const findChef = () => {
  const data = {
    searchInput : document.querySelector('.search-input').value,
    locationInput: document.querySelector('#autocomplete-input').value,
    radius : "50"
  }
  sessionStorage.setItem('fyc-search', JSON.stringify(data));
  location.href='/explore.html';
  console.log(data)
}

const loadLatestChefs = () => {
  axios
    .get(`${baseURL}/chefs?page=1`)
    .then((res) => {
      console.log(res.data.payload.data)
      const recipes = res.data.payload.data.data;
      popLatestRecipes(recipes)
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message)
      } else {
        toastr.error('Something went wrong, please try again')
      }
    })
}

 const loadChefPage = (id) => {
   localStorage.setItem('fyc-chef-id', id)
   location.href = '/chef-details.html'
 }


const carouselItem = document.querySelector('.simple-slick-carousel')
if (carouselItem) {
  carouselItem.addEventListener('click', (e) => {
    const id = e.target.dataset.id
    if (e.target.classList.contains('like-icon')) {
      e.stopPropagation()
      bookmarkChef(e, id)
    } else {
      loadChefPage(id)
    }
  })
}

const popLatestRecipes = (recipes) => {
  const recipeContainer = document.querySelector('.simple-slick-carousel');
  recipes.forEach(recipe => {
    const name = recipe.name;
    const category = recipe.categories;
    const chefName = recipe.fullname
    const image = recipe.profilePic;
    const price = recipe.price;
    const location = recipe.coords;
    const id = recipe._id;
    const stars = recipe.stars;
    const count = recipe.reviewCount;
    const event = window.Event;
    if (count <= 1) {
      review = 'review'
    } else {
      review = 'reviews'
    }


    let listItem = `

    <!-- Listing Item -->
    <div data-id="${id}" class="carousel-item">
        <a data-id="${id}" class="listing-item-container">
            <div data-id="${id}" class="listing-item">
                <img data-id="${id}" src="${image}" alt="">
                <div class="listing-badge now-open">Available</div>
                <div data-id="${id}" class="listing-item-details">
                    <ul>
                        <li>Starting from $${price} per meal</li>
                    </ul>
                </div>
                <div data-id="${id}" class="listing-item-content">
                    <span class="tag">${category}</span>
                    <h3 data-id="${id}">${chefName} <i class="verified-icon"></i></h3>
                    <span data-id="${id}">${location}</span>
                </div>
                <span data-id="${id}" class="like-icon"></span>
            </div>
            <div data-id="${id}" class="star-rating" data-rating="${stars}">
                <div class="rating-counter">(${count} ${review})</div>
            </div>
        </a>
    </div>
    <!-- Listing Item / End -->
    `
    recipeContainer.innerHTML += listItem;
  })

 
  
/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }

    });

  } starRating('.star-rating');


  setTimeout(() => {
   return $('.simple-slick-carousel').slick({
    infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3,
		dots: true,
		arrows: true,
		responsive: [
		    {
		      breakpoint: 992,
		      settings: {
		        slidesToShow: 2,
		        slidesToScroll: 2
		      }
		    },
		    {
		      breakpoint: 769,
		      settings: {
		        slidesToShow: 1,
		        slidesToScroll: 1
		      }
		    }
	  ]
  });
  })
}
// function makeSlider (){
//   $('.simple-slick-carousel').slick({
//     infinite: true,
// 		slidesToShow: 3,
// 		slidesToScroll: 3,
// 		dots: true,
// 		arrows: true,
// 		responsive: [
// 		    {
// 		      breakpoint: 992,
// 		      settings: {
// 		        slidesToShow: 2,
// 		        slidesToScroll: 2
// 		      }
// 		    },
// 		    {
// 		      breakpoint: 769,
// 		      settings: {
// 		        slidesToShow: 1,
// 		        slidesToScroll: 1
// 		      }
// 		    }
// 	  ]
//   });
// } makeSlider();

/* BOOKMARK CHEF */

const bookmarkChef = (e, id) => {
e.preventDefault();
e.stopPropagation();
  const token =
    localStorage.getItem('fyc-token') || sessionStorage.getItem('fyc-token')
  if (token) {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    const chefID = id;
    let bookmarkersID = userData._id;
    const data = {
      bookmarkersID,
      chefID
    }
    console.log(data);
    if (localStorage.getItem('fyc-bookmark-id') === null) {
      axios.post(`${baseURL}/bookmark/chef`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        console.log(res);
        toastr.success('Chef bookmarked');
        localStorage.setItem('fyc-bookmark-id', res.data.payload.data._id);
      }).catch((err) => {
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    } else {
      toastr.error('This chef has already been bookmarked'); 
    }
  } else {
    toastr.error('You need to login before bookmarking a chef');
  }
}


const getPosition = (showPosition) => {
  const lat = showPosition.coords.latitude;
  const lng = showPosition.coords.longitude;
  const latlng = {
    lat,
    lng
  }
  sessionStorage.setItem('fyc-coords', JSON.stringify(latlng));
}

const getLocation = (showPosition) => {
  const lat = showPosition.coords.latitude;
  const lng = showPosition.coords.longitude;
  const latlng = {
    lat,
    lng
  }
  sessionStorage.setItem('fyc-coords', JSON.stringify(latlng));
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({location: latlng}, (results, status) => {
    if (status === "OK") {
        if (results[0]) {
          console.log(results);
          const city = results[0].address_components[3].long_name;
          const state = results[0].address_components[6].short_name;
          const address = `${city}, ${state}`
          const locationInput = document.querySelector('#autocomplete-input');
          locationInput.value = address;
        } else {
          window.alert('No results found');
        }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}

const showLocation = () => {
  const latlng = JSON.parse(sessionStorage.getItem('fyc-coords'));
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({location: latlng}, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        console.log(results);
        // const city = results[0].address_components[3].long_name;
        // const state = results[0].address_components[6].short_name;
        // const address = `${city}, ${state}`;
        const address = results[0].formatted_address
        const locationInput = document.querySelector('#autocomplete-input');
        locationInput.value = address;
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}



/*----------------------------------------------------*/
/*  Rating Overview Background Colors
/*----------------------------------------------------*/
function ratingOverview(ratingElem) {

  $(ratingElem).each(function() {
    var dataRating = $(this).attr('data-rating');
    // Rules
      if (dataRating >= 4.0) {
          $(this).addClass('high');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
      } else if (dataRating >= 3.0) {
          $(this).addClass('mid');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
      } else if (dataRating < 3.0) {
          $(this).addClass('low');
          $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
      }

  });
} ratingOverview('.rating-bars-rating');

$(window).on('resize', function() {
  ratingOverview('.rating-bars-rating');
});


/*----------------------------------------------------*/
/*  Ratings Script
/*----------------------------------------------------*/

/*  Numerical Script
/*--------------------------*/
function numericalRating(ratingElem) {

	$(ratingElem).each(function() {
		var dataRating = $(this).attr('data-rating');

		// Rules
	    if (dataRating >= 4.0) {
	        $(this).addClass('high');
	    } else if (dataRating >= 3.0) {
	        $(this).addClass('mid');
	    } else if (dataRating < 3.0) {
	        $(this).addClass('low');
	    }

	});

} numericalRating('.numerical-rating');


/*  Star Rating
/*--------------------------*/
function starRating(ratingElem) {

	$(ratingElem).each(function() {

		var dataRating = $(this).attr('data-rating');
		// Rating Stars Output
		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
			return(''+
				'<span class="'+firstStar+'"></span>'+
				'<span class="'+secondStar+'"></span>'+
				'<span class="'+thirdStar+'"></span>'+
				'<span class="'+fourthStar+'"></span>'+
				'<span class="'+fifthStar+'"></span>');
		}

		var fiveStars = starsOutput('star','star','star','star','star');

		var fourHalfStars = starsOutput('star','star','star','star','star half');
		var fourStars = starsOutput('star','star','star','star','star empty');

		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
		var threeStars = starsOutput('star','star','star','star empty','star empty');

		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

    // Rules
    console.log('dataRating');
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
            // document.querySelector('.star-rating').innerHTML += fourStars;
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
            // document.querySelector('.star-rating').innerHTML += 'threeHalfStars';
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating < 1.25) {
            $(this).append(oneStar);
        }
	});

} starRating('.star-rating');

const fetchOverview = () => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  console.log(userData);
  if (userData.role === 'chef') {
    if (userData.numberVerified === false) {
      const titleBar = document.querySelector('#titlebar');
      titleBar.innerHTML += `
      <div class="row verify-phone-row">
        <div class="col-md-12">
          <button id="verify-phone" onclick="sendChefOTP(event)" type="submit" class="button border fw margin-top-10 display-none">
            Verify Phone number
          </button>
        </div>
      </div>`;
    }
    if (!userData.emailVerified ||
        !userData.IDVerified ||
        userData.availability.length == 0 ||
        userData.categories.length == 0 ||
        userData.coords == "" ||
        !userData.numberVerified ||
        userData.facebook == "" ||
        userData.google == "" ||
        userData.location == "" ||
        userData.notes == "" || 
        userData.perimeter == "" ||
        userData.profilePic == "" ||
        userData.twitter == "" ) {
      toastr.error('Please update your profile!!');
    }
  }
  if (userData.role === 'chef') {
    const userID = userData._id;
    axios.get(`${baseURL}/chefs/overview/${userID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res.data.payload.data);
      const dashData = res.data.payload.data;
      popDash(dashData);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  } else {
    const userID = userData._id;
    axios.get(`${baseURL}/users/overview/${userID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res.data.payload.data);
      const dashData = res.data.payload.data;
      popDash(dashData);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
}


const popDash = (data) => {
  const views = parseFloat(data.views);
  const activeRecipe = data.activeRecipes;
  const totalReviews = data.totalReviews;
  const bookmarkCount = data.bookmarkCount;

  document.querySelector('.color-1').innerHTML = `<div class="dashboard-stat-content"><h4>${activeRecipe}</h4> <span>Active Recipe</span></div>
  <div class="dashboard-stat-icon"><i class="im im-icon-Map2"></i></div>`;

  document.querySelector('.color-2').innerHTML = `<div class="dashboard-stat-content"><h4>${views}</h4> <span>Total Views</span></div>
  <div class="dashboard-stat-icon"><i class="im im-icon-Line-Chart"></i></div>`;

  document.querySelector('.color-3').innerHTML = `<div class="dashboard-stat-content"><h4>${totalReviews}</h4> <span>Total Reviews</span></div>
  <div class="dashboard-stat-icon"><i class="im im-icon-Add-UserStar"></i></div>`;

  document.querySelector('.color-4').innerHTML = `<div class="dashboard-stat-content"><h4>${bookmarkCount}</h4> <span>Times Bookmarked</span></div>
  <div class="dashboard-stat-icon"><i class="im im-icon-Heart"></i></div>`;


  $(".dashboard-stat-content h4").counterUp({
    delay: 100,
    time: 1000
  });
}

const loadSidebar = () => {
  const dashboard = document.querySelector('.dashboard-nav');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  if (userData.role === 'chef') {
    dashboard.innerHTML = `
		<div class="dashboard-nav-inner">
			<ul data-submenu-title="Main">
				<li class="active"><a href="dashboard.html"><i class="sl sl-icon-settings"></i> Dashboard</a></li>
				<li><a href="dashboard-messages.html"><i class="sl sl-icon-envelope-open"></i> Messages <span class="nav-tag messages">2</span></a></li>
				<li><a href="dashboard-bookings.html"><i class="fa fa-calendar-check-o"></i> Bookings</a></li>
				<li><a href="dashboard-wallet.html"><i class="sl sl-icon-wallet"></i> Wallet</a></li>
			</ul>
			
			<ul data-submenu-title="Recipe">
				<li class="recipeState"><a onclick="toggleState(event)"><i class="sl sl-icon-layers"></i> My Recipes</a>
					<ul>
						<li><a id="activerecipe" href="dashboard-my-active-listings.html">Active <span class="nav-tag green">6</span></a></li>
						<li><a href="dashboard-my-pending-listings.html">Pending <span class="nav-tag yellow">1</span></a></li>
					</ul>	
				</li>
				<!--<li><a href="dashboard-chef-reviews.html"><i class="sl sl-icon-star"></i> Reviews</a></li>-->
				<!--<li><a href="dashboard-bookmarks.html"><i class="sl sl-icon-heart"></i> Bookmarks</a></li>-->
				<li class="toggleReviews"><a onclick="toggleReviewState(event)"><i class="sl sl-icon-star"></i> Reviews</a>
          <ul>
            <li><a href="dashboard-chef-reviews.html">Chef</a></li>
            <li><a href="dashboard-recipe-reviews.html">Recipe</a></li>
          </ul>
        </li>
        <li><a href="dashboard-add-listing.html"><i class="sl sl-icon-plus"></i> Add Recipe</a></li>
      </ul>	

			<ul data-submenu-title="Account">
				<li><a href="dashboard-my-chef-profile.html"><i class="sl sl-icon-user"></i> My Profile</a></li>
				<li><a href="#" onclick="handleLogout()"><i class="sl sl-icon-power"></i> Logout</a></li>
			</ul>
			
		</div>
    `;
  } else {
    dashboard.innerHTML = `
    <div class="dashboard-nav-inner">

    <ul data-submenu-title="Main">
      <li class="active"><a href="dashboard.html"><i class="sl sl-icon-settings"></i> Dashboard</a></li>
      <li><a href="dashboard-messages.html"><i class="sl sl-icon-envelope-open"></i> Messages <span class="nav-tag messages">2</span></a></li>
      <li><a href="dashboard-bookings.html"><i class="fa fa-calendar-check-o"></i> Bookings</a></li>
      <li><a href="dashboard-wallet.html"><i class="sl sl-icon-wallet"></i> Wallet</a></li>
    </ul>
    
    <ul data-submenu-title="Recipe">
      <!--<li class="toggleReviews"><a onclick="toggleReviewState(event)"><i class="sl sl-icon-star"></i> Reviews</a>
        <ul>
          <li><a href="dashboard-usertchef-reviews.html">Chef</a></li>
          <li><a href="dashboard-user-reviews.html">Recipe</a></li>
        </ul>
      </li>-->
      <li><a href="dashboard-user-reviews.html"><i class="sl sl-icon-star"></i> Reviews</a></li>
      <li><a href="dashboard-bookmarks.html"><i class="sl sl-icon-heart"></i> Bookmarks</a>
    </li>
    </ul>	

    <ul data-submenu-title="Account">
      <li><a href="dashboard-my-user-profile.html"><i class="sl sl-icon-user"></i> My Profile</a></li>
      <li><a href="#" onclick="handleLogout()"><i class="sl sl-icon-power"></i> Logout</a></li>
    </ul>
    
  </div>
    `;
  }
} 

const toggleReviewState = (e) => {
  // e.target.parentElement.classList.toggle('active');
  const reviewParent = document.querySelector('.toggleReviews');
  if (reviewParent.className === 'toggleReviews active') {
    console.log('removing active class');
    reviewParent.className = 'toggleReviews';
  } else {
    reviewParent.className += ' active';
    console.log('adding active class');
  }
}

const toggleBookmarkState = (e) => {
  // e.target.parentElement.classList.toggle('active');
  const reviewParent = document.querySelector('.toggleBookmarks');
  if (reviewParent.className === 'toggleBookmarks active') {
    console.log('removing active class');
    reviewParent.className = 'toggleBookmarks';
  } else {
    console.log('adding active class');
    reviewParent.className += ' active';
  }
}

const toggleState = (e) => {
  const reviewParent = document.querySelector('.recipeState');
  if (reviewParent.className === 'recipeState active') {
    console.log('removing active class');
    reviewParent.className = 'recipeState';
  } else {
    console.log('adding active class');
    reviewParent.className += ' active';
  }
}

const loadProfile = () => {
  const passBtn = document.querySelector('.passbaseBtn');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));

  if (userData.role === "chef") {
    if (!userData.IDVerified) {
      passBtn.style.visibility = 'visible';
    } else {
      passBtn.style.visibility = 'hidden';
    }
  }else {
    passBtn.style.visibility = 'hidden';
  }
}