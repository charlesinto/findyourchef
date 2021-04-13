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

let myDropzone;

const setDetails = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  if(userData.role == "chef") {
    document.querySelector('.user-img').src = userData.profilePic;
    document.getElementById('fn').value = userData.fullname;
    document.querySelector('.phoneNumber').value = userData.phoneNumber;
    document.querySelector('.email').value = userData.email;
    document.querySelector('#notes').value = userData.notes;
    document.querySelector('.twitter').value = userData.twitter;
    document.querySelector('.facebook').value = userData.facebook;
    document.querySelector('.google').value = userData.google;
    // document.querySelector('#my-awesome-dropzone').action = `${baseURL}/chef/images/${userData._id}`;
    if (userData.location != "") {
      document.querySelector('#autocomplete-input').value = userData.location;
    }
    if (userData.perimeter != "") {
      document.querySelector('.distance-radius').value = parseFloat(userData.perimeter);
    } else {
      document.querySelector('.distance-radius').value = 50;
    }
    if (userData.images.length > 0) {
      const images = userData.images;
      images.forEach( (image, index) => {
        document.querySelector('.gallery-listing').innerHTML += `    <li>
        <div class="">
          <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        </div>
        <div class="image-delete">
          <a href="#" onclick="delImage(event, ${index})" class="button gray"><!--<i class="sl sl-icon-close">--></i> Delete</a>
        </div>
      </li>`
      })
      
    }
    // Dropzone.autoDiscover = false;
    
    // myDropzone = new Dropzone(".dropzone", {
    //   autoProcessQueue: false,
    //   addRemoveLinks: true,
    //   parallelUploads: 10,
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   },
    // })
    // document.querySelector('body').innerHTML += `<script type="text/javascript" src="scripts/dropzone.js"></script>`;

    
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
    console.log(data)

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
    if (userData.profilePic != profilePic) {
      data.profilePic = profilePic;
    }
    if (userData.fullname != fullname) {
      data.fullname = fullname;
    }
    if (userData.username != username) {
      data.username = username;
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
  sessionStorage.setItem('fyc-profile-coords', JSON.parse(latlng))
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({location: latlng}, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        const city = results[0].address_components[3].long_name;
        const state = results[0].address_components[6].short_name;
        const coords = `${city}, ${state}`;
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('photoForm');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let data = e.target.querySelector('#file').files[0];
    console.log("data is => ", data);
    const formData = new FormData(this);
    console.log(formData);
    formData.append('Data', data);

    if (userData.role == 'chef') {
      let options = {
        method: 'POST',
        headers: {
              Authorization: `Bearer ${token}`
        },
        body: formData
    }

      fetch(`${baseURL}/chef/profile-image`, options)
      .then(res => res.json())
  .then(res => {
    console.log("res is ", res)
    toastr.success('Picture uploaded!');
    const userData = res.payload.data;
    setData(userData);
  })
  .catch(err => console.error(err));
    } else {
  let options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  }

    fetch(`${baseURL}/user/profile-image`, options)
    .then(res => res.json())
    .then(res => {
      console.log("res is ", res)
      toastr.success('Picture uploaded!');
      const userData = res.payload.data;
      setData(userData);
    })
  .catch(err => console.error(err));
    }
  })
})

const setData = (data) => {
  const username = document.querySelector('.logged-username');
if (username) {
  const userData = data;
  document.querySelector('.user-img').src = userData.profilePic;
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

}

const delImage = (e, index) => {
  e.preventDefault();
  axios.delete(`${baseURL}/chef/images/${index}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    toastr.success("Image Deleted!");
    sessionStorage.setItem('fyc-user', JSON.stringify(res.data.payload.data));
    e.target.parentElement.parentElement.remove();
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  }); 
}

//? UPLOADING IMAGES FOR CHEF
let dropArea = document.getElementById('drop-area');
let filesDone = 0;
let filesToDo = 0;
let progressBar = document.getElementById('progress-bar');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
})

// ['dragleave', 'drop'].forEach(eventName => {
//   dropArea.addEventListener(eventName, unhighlight, false);
// })

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  files = [...files];
  files.forEach(uploadFile);
  files.forEach(previewFile)
}

function uploadFile(file) {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let formData = new FormData();
  formData.append('file', file);
  let options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  }

  fetch(`${baseURL}/chef/images/${userData._id}`, options)
  .then(res => res.json())
  .then((res) => {
    console.log(res);
    addImagetoDOM(res.payload.data);
    sessionStorage.setItem('fyc-user', JSON.stringify(res.payload.data));
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function() {
    let img = document.createElement('img');
    img.src = reader.result;
    document.getElementById('gallery').appendChild(img)
  }
}

function addImagetoDOM(data) {
  document.querySelector('.gallery-listing').innerHTML = "";
  const images = data.images;
      images.forEach( (image, index) => {
        document.querySelector('.gallery-listing').innerHTML += `    <li>
        <div class="">
          <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        </div>
        <div class="image-delete">
          <a href="#" onclick="delImage(event, ${index})" class="button gray"><!--<i class="sl sl-icon-close">--></i> Delete</a>
        </div>
      </li>`
      })
}
