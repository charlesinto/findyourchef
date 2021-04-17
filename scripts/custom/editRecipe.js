const recipeData = JSON.parse(sessionStorage.getItem('fyc-single-recipe'));
const id = recipeData._id;
const setRecipeData = () => {
  console.log(recipeData);
  document.querySelector('.search-field').value = recipeData.name;
  // document.querySelector('#category').value = recipeData.category;
  const keys = recipeData.tags;
  let keywords = "";
  keys.forEach(key => {
    keywords += `${key},`
  })
  const keyword = keywords.slice(0, -1);
  document.querySelector('#keywords').value = keyword;
  document.querySelector('#autocomplete-input').value = recipeData.location;
  document.querySelector('.WYSIWYG').value = recipeData.overview;
  if (recipeData.images.length > 0) {
    const images = recipeData.images;
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
}

const updateRecipe = (e) => {
  e.preventDefault();
  const button = document.querySelector('#update-recipe');
  const recipeData = JSON.parse(sessionStorage.getItem('fyc-single-recipe'));
  const data = {};
  const name = document.querySelector('.search-field').value;
  const category = document.querySelector('#category').value;
  const keywords = document.querySelector('#keywords').value;
  const tags = keywords.split(',');
  const location = document.querySelector('#autocomplete-input').value = recipeData.location;
  const overview = document.querySelector('.WYSIWYG').value = recipeData.overview;
  data.tags = tags;
  if (category != "" && recipeData.category != category) {
    data.category = category;
  }
  if(recipeData.name != name) {
    data.name = name;
  }
  if (recipeData.location != location) {
    data.location = location;
  }
  if (recipeData.overview != overview) {
    data.overview = overview;
  }
  button.innerHTML = '<div class="loader"></div>';
  button.setAttribute('disabled', true);

  console.log(data);
  axios.put(`${baseURL}/chef/recipe`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    toastr.success(res.data.payload.data);
    button.innerHTML = 'Update Recipe';
    button.removeAttribute('disabled');
    backToRecipes();
  }).catch((err) => {
    button.innerHTML = 'Update Recipe';
    button.removeAttribute('disabled');
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  })
}

const backToRecipes = () => {
  localStorage.removeItem('fyc-single-recipe');
  location.href = '/dashboard-my-active-listings.html';
}


//? DELETING UPLOADED RECIPE IMAGES
const delImage = (e, index) => {
  e.preventDefault();
  axios.delete(`${baseURL}/chef/recipe/images/${id}/${index}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    toastr.success("Image Deleted!");
    // sessionStorage.setItem('fyc-user', JSON.stringify(res.data.payload.data));
    e.target.parentElement.parentElement.remove();
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  }); 
}

//? UPLOADING IMAGES FOR RECIPE
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
  let formData = new FormData();
  formData.append('file', file);
  let options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  }

  fetch(`${baseURL}/chef/recipe/images/${id}`, options)
  .then(res => res.json())
  .then((res) => {
    console.log(res);
    addImagetoDOM(res.payload.data);
    sessionStorage.setItem('fyc-single-recipe', JSON.stringify(res.payload.data));
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
