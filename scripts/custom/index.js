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

const sendChefOTP = (user) => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const data = {
    email: userData.email,
  };
  $.magnificPopup.open({
    items: {
      src: '#otp-dialog', // can be a HTML string, jQuery object, or CSS selector
      type: 'inline'
    }
  });
  console.log(data);
  document.querySelector('#otp').focus();
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

const verifyOTP = (e) => {
  const data = {
    email: localStorage.getItem('fyc-email'),
    otp: document.querySelector('#otp').value
  }
  localStorage.removeItem('fyc-email');
  e.preventDefault();
  const button = document.querySelector('#otp-btn');

  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  axios.post(`${baseURL}/user/verify-number`, data).then((res) => {
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
    verifyOTP(e);
    button.innerHTML = 'Register';
    button.removeAttribute('disabled');
    // location.href = '/login.html';
    // form.classList.add('display-none');
    // message.classList.remove('display-none');
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
  let availability = {
    "monday" : [],
    "tuesday" : [],
    "wednesday" : [],
    "thursday" : [],
    "friday" : [],
    "saturday" : [],
    "sunday" : []
  };
  addListingSection.addEventListener('click', (e) => {
    if (e.target.textContent === 'Add') {
      let startInput = e.target.parentElement.parentElement.children[0].children[0].value;
      let endInput = e.target.parentElement.parentElement.children[0].children[3].value;
      let parent = e.target.parentElement.parentElement.parentElement.children[0].textContent.toLowerCase();
      let startArr = startInput.split(':');
      let arrStart = [];
      startArr.forEach(item => {
        let timeVal = parseInt(item);
        arrStart.push(timeVal);
      });
      let endArr = endInput.split(':');
      let arrEnd = [];
      endArr.forEach(item => {
        let timeVal = parseInt(item);
        arrEnd.push(timeVal);
      })
      // const dayID = Math.random()*Date.now();
      availability[parent].push({
        "startHours": arrStart[0],
        "startMinutes": arrStart[1],
        "endHours": arrEnd[0],
        "endMinutes": arrEnd[1],
        // id: dayID
      })
    }else if (e.target.id === 'post-recipe') {
      e.preventDefault();
      e.target.innerHTML = '<div class="loader"></div>';
      e.target.setAttribute('disabled', true);
      const name = document.querySelector('#recipe-title').value;
      // const category = document.querySelector('#category').value;
      const category = "Beverage"
      const keywords = document.querySelector('#keywords').value;
      const tags = keywords.split(',');
      const location = document.querySelector('#location').value;
      const radius = document.querySelector('#radius').value;
      const dropzone = document.querySelector('#dropzone').value;
      const overview = document.querySelector('#summary').value;
      const phoneOptional = document.querySelector('#phone-optional').value;
      const websiteOptional = document.querySelector('#website-optional').value;
      const emailOptional = document.querySelector('#email-optional').value;
      const coords = "39.7993942,-78.9658362";
      const perimeter = ["1.02433,0.84950", "2.4923,1.490493"];
      const price = "40";
      const data = {
        name,
        location,
        price,
        coords,
        overview,
        category,
        perimeter,
        tags,
        availability
      }
      const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
      axios.post(`${baseURL}/chef/recipe`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then((res) => {
        e.target.removeAttribute('disabled');
        e.target.innerHTML = 'Post Recipe <i class="fa fa-arrow-circle-right"></i>';
        const fycChefId = res.data.payload.data.chefID;
        const fyc_Id = res.data.payload.data._id;
        localStorage.setItem('fyc-chef-id', fycChefId);
        localStorage.setItem('fyc-id', fyc_Id);
        console.log(res);
        toastr.success('Recipe added successfully!');
      }).catch((err) => {
        e.target.removeAttribute('disabled');
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    }
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

        button.setAttribute('disabled', true);
      }
    }) 
  }

  /* DASHBOARD ACCOUNT VERIFICATION */

  if (location.href.endsWith('/dashboard.html')) {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    const verifyPhoneBtn = document.querySelector('#verify-phone');
    if (userData.emailVerified === false ) {
      toastr.error('Please verify your Email Address!');
    }
    if (userData.numberVerified === false ) {
      toastr.error('Please verify your Phone Number!');
      verifyPhoneBtn.classList.remove('display-none');
    }
    verifyPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendChefOTP('chef');
    })
    if (userData.IDVerified === false ) {
      toastr.error('Please verify your ID!');
    }
  };
  
  /* SHOW USER'S NAME WHEN THEY LOGIN */

  const username = document.querySelector('.logged-username');
  if (username) {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    const user = userData.username;
    const image = userData.image;
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
    console.log('get recipes');
    const chefID = localStorage.getItem('fyc-id');
		const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
		const baseURL = 'https://thepotters-api.herokuapp.com/api/v1';
    const data = {
      chefID,
		};
			axios.post(`${baseURL}/chef/recipe/list?status=active&page=3`, data, {
				headers: {
					'Authorization': `Bearer ${token}`
				},
			}).then((res) => {
				console.log(res);
				const recipes = res.data.payload.data;
				popRecipe(recipes);
			}).catch((err) => {
				if (err.response && err.response.data) {
					toastr.error(err.response.data.error.message);
				} else {
					toastr.error('Something went wrong, please try again');
				}
			});
	};
	const popRecipe = (recipes) => {
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
							<div class="star-rating" data-rating="5">
								<div class="rating-counter">(12 reviews)</div>
							</div>
						</div>
					</div>
				</div>
				<div class="buttons-to-right">
					<div class="edit-recipe"><a onclick="editRecipe()" href="#" class="button gray"><i class="sl sl-icon-note"></i> Edit</a></div>
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
        chefID,
        recipeID
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
  
  /* VIEW ALL RECIPES */
  const loadAllRecipes = () => {
    axios.get(`${baseURL}/recipes?page=1`).then((res) => {
      console.log(res.data.payload.data);
      const recipes = res.data.payload.data;
      popAllRecipes(recipes);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  };
  
  const popAllRecipes = (recipes) => {
    const length = recipes.length;
    let result;
    if (length === 1) {
      result = "Result";
    } else {
      result = "Results";
    }
    const recipeContainer = document.querySelector('.recipe-container');
    const resultsFound = document.querySelector('.results-found');
    resultsFound.innerHTML = `<p class="showing-results">${length} ${result} Found </p>`
    recipeContainer.innerHTML = "";
    recipes.forEach(recipe => {
      const name = recipe.name;
      const category = recipe.category;
      const chefName = recipe.chefName;
      const image = recipe.image;
      const price = recipe.price;
      const location = recipe.location;
      let listItem =  `
      <div class="col-lg-12 col-md-12">
        <div class="listing-item-container list-layout" data-marker-id="1">
          <a href="listings-single-page.html" class="listing-item">
            
            <!-- Image -->
            <div class="listing-item-image">
              <img src="${image}" alt="">
              <span class="tag">${category}</span>
            </div>
            
            <!-- Content -->
            <div class="listing-item-content">
              <div class="listing-badge now-open">Available</div>

              <div class="listing-item-inner">
                <h3>${name}</h3>
                <p>${chefName}<i class="verified-icon"></i></p>
                <p>${location}</p>
                <div class="star-rating" data-rating="3.5">
                  <div class="rating-counter">(12 reviews)</div>
                </div>
              </div>

              <span class="like-icon"></span>
              <div class="listing-item-details">Starting from $${price} per meal</div>

            </div>
          </a>
        </div>
      </div>
      `;
      recipeContainer.innerHTML += listItem;
    })
    
  }