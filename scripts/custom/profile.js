// const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
// const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
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

const setDetails = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  document.querySelector('.user-img').src = userData.profilePic;
  document.querySelector('.fullname').value = userData.fullname;
  document.querySelector('.phoneNumber').value = userData.phoneNumber;
  document.querySelector('.email').value = userData.email;
  document.querySelector('#notes').value = userData.notes;
  document.querySelector('.twitter').value = userData.twitter;
  document.querySelector('.facebook').value = userData.facebook;
  document.querySelector('.google').value = userData.google;
}

const updateProfile = () => {
  const button = document.querySelector('.button');
  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);
  const catParent = document.querySelector('.category-edit').children;
  let categories = [];
  Array.prototype.forEach.call(catParent, function(cat) {
    if (cat.children[1].checked) {
      categories.push(cat.children[1].value);
    }
  });
  console.log(categories);
  const distance = document.querySelector('.distance-radius').value;
  const profilePic = document.querySelector('.user-img').src;
  const fullname = document.querySelector('.fullname').value;
  const phoneNumber = document.querySelector('.phoneNumber').value;
  const email = document.querySelector('.email').value;
  const notes = document.querySelector('#notes').value;
  const twitter = document.querySelector('.twitter').value;
  const facebook = document.querySelector('.facebook').value;
  const google = document.querySelector('.google').value;
  const coords = sessionStorage.getItem('fyc-profile-coords');

  const data = {
    distance,
    categories,
    profilePic,
    fullname,
    phoneNumber,
    email,
    notes,
    twitter,
    facebook,
    google,
    coords
  }
  axios.put(`${baseURL}/signup/chef`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    toastr.success('Profile Updated');
    button.innerHTML = 'Update Profile';
    button.removeAttribute('disabled');
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
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
        const coords = results[0].formatted_address;
        sessionStorage.setItem('fyc-profile-coords', coords);
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert(`Geocoder failed due to ${status}`);
    }
  });
}

if (userData.coords === "") {
  navigator.geolocation.getCurrentPosition(getCoords);
}
