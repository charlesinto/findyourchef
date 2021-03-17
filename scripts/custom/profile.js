const loadCategories = () => {
  axios.get(`${baseURL}/category?page=1`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const categories = res.data.payload.data;
    popCategories(categories);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const popCategories = (categories) => {
  const edit = document.querySelector('.category-edit');
  categories.forEach((category, index) => {
    const tag = category.name;
    edit.innerHTML += `<div class="check-div">
      <label for="${tag}">${tag}</label>
      <input type="checkbox" value="${tag}" id="${tag + index}" name="${tag}">
    </div>`;
  });
}

const checkUser = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  if (userData.role == "chef") {
    document.querySelector('.edit').innerHTML += `
    <label>Notes</label>
    <textarea name="notes" id="notes" cols="30" rows="10">Maecenas quis consequat libero, a feugiat eros. Nunc ut lacinia tortor morbi ultricies laoreet ullamcorper phasellus semper</textarea>

    <label><i class="fa fa-twitter"></i> Twitter</label>
    <input class="twitter" placeholder="https://www.twitter.com/" type="text">

    <label><i class="fa fa-facebook-square"></i> Facebook</label>
    <input class="facebook" placeholder="https://www.facebook.com/" type="text">

    <label><i class="fa fa-google-plus"></i> Google+</label>
    <input class="google" placeholder="https://www.google.com/" type="text">

    <div class="category">
      <h5 class="bold">Select Category</h5>
      <div class="category-edit"></div>
    </div>
    <div class="radius">
      <h5 class="bold">Distance Radius</h5>
      <div class="panel-dropdown-content">
        <input class="distance-radius" type="range" min="1" max="100" step="1" value="50" data-title="Radius around selected destination">
      </div>
    </div>
    
    
        <!-- Section -->
        <div class="margin-top-45">
          <!-- Row -->
          <div class="row with-forms">
              <!-- Address -->
              <div class="col">
                  <label>Primary Location</label>
                  <!--<input id="location" type="text" placeholder="Laurel, MD 20708">-->
                  <div class="main-search-input-item location">
                      <div id="autocomplete-container">
                          <input id="autocomplete-input" type="text" placeholder="Laurel, MD 20708">
                      </div>
                      <a href="#"><i class="fa fa-map-marker"></i></a>
                  </div>
              </div>
          </div>
            <!-- Row / End -->
        </div>
        <!-- Section / End -->

        <label>Your Name</label>
        <input class="fullname" value="Tom Perrin" type="text">

        <label>Phone</label>
        <input class="phoneNumber" value="(123) 123-456" type="text">

        <label>Email</label>
        <input class="email" value="tom@example.com" type="text">



    `;
    document.querySelector('.availability-div').innerHTML += `<!-- Section -->
    <div class="add-listing-section margin-top-45">

      <!-- Headline -->
      <div class="add-listing-headline">
          <h3><i class="fa fa-calendar-check-o"></i> Availability</h3>
          <!-- Switcher -->
          <label class="switch"><input type="checkbox" checked><span class="slider round"></span></label>
      </div>

      <!-- Switcher ON-OFF Content -->
      <div class="switcher-content">

          <!-- Availablity Slots -->
          <!-- Set data-clock-type="24hr" to enable 24 hours clock type -->
          <div class="availability-slots" data-clock-type="24hr">

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Monday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">

                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input id="start-monday-input" type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="start-monday-select">
<option value="am">am</option>
<option value="pm">pm</option>
</select>
                          <span>-</span>

                          <input id="end-monday-input" type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="end-monday-select">
<option value="am">am</option>
<option value="pm">pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)" id="addMondaySlot">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Tuesday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">

                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                          <span>-</span>

                          <input type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Wednesday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">

                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                          <span>-</span>

                          <input type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Thursday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">

                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                          <span>-</span>

                          <input type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Friday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">


                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                          <span>-</span>

                          <input type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Saturday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">

                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                          <span>-</span>

                          <input type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

              <!-- Single Day Slots -->
              <div class="day-slots">
                  <div class="day-slot-headline">Sunday</div>

                  <!-- Slot For Cloning / Do NOT Remove-->
                  <div class="single-slot cloned">
                      <div class="single-slot-left">
                          <div class="single-slot-time"></div>
                          <button class="remove-slot"><i class="fa fa-close"></i></button>
                      </div>

                      <div class="single-slot-right">
                          <strong>Slots:</strong>
                          <div class="plusminus horiz">
                              <button></button>
                              <input type="number" name="slot-qty" value="1" min="1" max="99">
                              <button></button>
                          </div>
                      </div>
                  </div>
                  <!-- Slot For Cloning / Do NOT Remove-->


                  <!-- No slots -->
                  <div class="no-slots">No slots added</div>

                  <!-- Slots Container -->
                  <div class="slots-container">

                  </div>
                  <!-- Slots Container / End -->


                  <!-- Add Slot -->
                  <div class="add-slot">
                      <div class="add-slot-inputs">
                          <input type="time" class="time-slot-start" min="00:00" max="12:00" />
                          <select class="time-slot-start twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                          <span>-</span>

                          <input type="time" class="time-slot-end" min="00:00" max="12:00" />
                          <select class="time-slot-end twelve-hr" id="">
<option>am</option>
<option>pm</option>
</select>
                      </div>
                      <div class="add-slot-btn">
                          <button onclick="addList(event)">Add</button>
                      </div>
                  </div>

              </div>
              <!-- Single Day Slots / End -->

          </div>
          <!-- Availablity Slots / End -->

      </div>
      <!-- Switcher ON-OFF Content / End -->
      <button onclick="updateAvailability()" class="button margin-top-15">Update Profile</button>

  </div>
  <!-- Section / End -->
  

`;
    loadCategories();
    setDetails();
  } else {
    document.querySelector('.edit').innerHTML += `
    <label>Your Name</label>
    <input class="fullname" value="Tom Perrin" type="text">

    <label>Username</label>
    <input class="username" value="Tommy" type="text">

    <label>Phone</label>
    <input class="phoneNumber" value="(123) 123-456" type="text">

    <label>Email</label>
    <input class="email" value="tom@example.com" type="text">

  `;
  setDetails();
  }
}

const setDetails = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  if(userData.role == "chef") {
    document.querySelector('.user-img').src = userData.profilePic;
    document.querySelector('.fullname').value = userData.fullname;
    document.querySelector('.phoneNumber').value = userData.phoneNumber;
    document.querySelector('.email').value = userData.email;
    document.querySelector('#notes').value = userData.notes;
    document.querySelector('.twitter').value = userData.twitter;
    document.querySelector('.facebook').value = userData.facebook;
    document.querySelector('.google').value = userData.google;
    if (userData.location != "") {
      document.querySelector('#autocomplete-input').value = userData.location;
    }
    if (userData.perimeter != "") {
      document.querySelector('.distance-radius').value = parseFloat(userData.perimeter);
    } else {
      document.querySelector('.distance-radius').value = 50;
    }
  } else {
    document.querySelector('.user-img').src = userData.image;
    document.querySelector('.fullname').value = userData.fullname;
    document.querySelector('.username').value = userData.username;
    document.querySelector('.phoneNumber').value = userData.phoneNumber;
    document.querySelector('.email').value = userData.email;
  }
}
let availability = {
  "monday" : [],
  "tuesday" : [],
  "wednesday" : [],
  "thursday" : [],
  "friday" : [],
  "saturday" : [],
  "sunday" : []
};
const addList = (e) => {
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
  });
  availability[parent].push({
    "startHours": arrStart[0],
    "startMinutes": arrStart[1],
    "endHours": arrEnd[0],
    "endMinutes": arrEnd[1],
  });
  console.log(availability);
}
const updateProfile = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const button = document.querySelector('.button-update');

  const data = {
  }
  if (userData.role == 'chef') {
    const catParent = document.querySelector('.category-edit').children;
    let categories = [];
    Array.prototype.forEach.call(catParent, function(cat) {
      if (cat.children[1].checked) {
        categories.push(cat.children[1].value);
      }
    });
    const perimeter = document.querySelector('.distance-radius').value;
    const profilePic = document.querySelector('.user-img').src;
    const fullname = document.querySelector('.fullname').value;
    const phoneNumber = document.querySelector('.phoneNumber').value;
    const email = document.querySelector('.email').value;
    const notes = document.querySelector('#notes').value;
    const twitter = document.querySelector('.twitter').value;
    const facebook = document.querySelector('.facebook').value;
    const google = document.querySelector('.google').value;
    const coords = sessionStorage.getItem('fyc-profile-coords');
    const location = document.querySelector('#autocomplete-input').value;
    if (categories.length != 0 && userData.categories != categories) {
      data.categories = categories;
    }
    if(userData.perimeter != perimeter) {
      data.perimeter = perimeter;
    }
    if (userData.profilePic != profilePic) {
      data.profilePic = profilePic;
    }
    if (userData.fullname != fullname) {
      data.fullname = fullname;
    }
    if (userData.phoneNumber != phoneNumber) {
      data.phoneNumber = phoneNumber;
    }
    if (userData.email != email) {
      data.email = email;
    }
    if (userData.notes != notes) {
      data.notes = notes;
    }
    if (userData.twitter != twitter) {
      data.twitter = twitter;
    }
    if (userData.location != location) {
      data.location = location;
    }
    if (userData.facebook != facebook) {
      data.facebook = facebook;
    }
    if (userData.google != google) {
      data.google = google;
    }
    if (userData.coords != coords) {
      data.coords = coords;
    }
    button.innerHTML = '<div class="loader"></div>';
    button.setAttribute('disabled', true);

    axios.put(`${baseURL}/signup/chef`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res.data.payload.data);
      toastr.success('Profile Updated');
      button.innerHTML = 'Update Profile';
      button.removeAttribute('disabled');
      // fetchChefData();
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    })
  } else {
    const profilePic = document.querySelector('.user-img').src;
    const fullname = document.querySelector('.fullname').value;
    const username = document.querySelector('.username').value;
    const phoneNumber = document.querySelector('.phoneNumber').value;
    const email = document.querySelector('.email').value;
    if (userData.profilePic != profilePic) {
      data.profilePic = profilePic;
    }
    if (userData.fullname != fullname) {
      data.fullname = fullname;
    }
    if (userData.username != username) {
      data.username = username;
    }
    if (userData.phoneNumber != phoneNumber) {
      data.phoneNumber = phoneNumber;
    }
    if (userData.email != email) {
      data.email = email;
    }
    data.userId = userData._id;
    button.innerHTML = '<div class="loader"></div>';
    button.setAttribute('disabled', true);

    axios.put(`${baseURL}/user/update`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res.data.payload.data);
      toastr.success('Profile Updated');
      button.innerHTML = 'Update Profile';
      button.removeAttribute('disabled');
      fetchUserData();
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    })
  }
}

const updateAvailability = () => {
  const button = document.querySelector('.button-available');
  const data = {};
  if (availability['monday'].length > 0 &&
      availability['tuesday'].length > 0 &&
      availability['wednesday'].length > 0 &&
      availability['thursday'].length > 0 &&
      availability['friday'].length > 0 &&
      availability['saturday'].length > 0 &&
      availability['sunday'].length > 0 ) {
        data.availability = availability;
        console.log(data);
        button.innerHTML = '<div class="loader"></div>';
        button.setAttribute('disabled', true);
      
        console.log(data);
        axios.put(`${baseURL}/chef/availability`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then((res) => {
          console.log(res.data.payload.data);
          toastr.success('Profile Updated');
          button.innerHTML = 'Update Profile';
          button.removeAttribute('disabled');
          sessionStorage.setItem('fyc-user', JSON.stringify(res.data.payload.data));
          // fetchChefData();
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        })
      } else {
        toastr.error("Please fill in all availability slots");
      }
}

const getCoords = (showPosition) => {
  const lat = showPosition.coords.latitude;
  const lng = showPosition.coords.longitude;
  const latlng = {
    lat,
    lng
  }
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({location: latlng}, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        const city = results[0].address_components[3].long_name;
        const state = results[0].address_components[6].short_name;
        const coords = `${city}, ${state}`;
        sessionStorage.setItem('fyc-profile-coords', coords);
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}

