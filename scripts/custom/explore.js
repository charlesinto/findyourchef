
/* VIEW RECIPES */
const loadAllRecipes = () => {
  const searchData = JSON.parse(sessionStorage.getItem('fyc-search'));

  /* VIEW ALL RECIPES */

  if (searchData === null) {
    const pagination = document.querySelector('.recipe-pagination');
    let page = 1;
    axios.get(`${baseURL}/recipes?page=${page}`).then((res) => {
      console.log(res);
      const recipes = res.data.payload.data;
      popAllRecipes(recipes);
      console.log(recipes);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
    pagination.addEventListener('click', (e) => {
      console.log(e.target.innerText);
      if (e.target.id === "next") {
        console.log('arrow-next');
        page += 1;
      } else {
        page = e.target.innerText;
      }
      axios.get(`${baseURL}/recipes?page=${page}`).then((res) => {
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
    })
  } else {
    /* VIEW SEARCHED RECIPES */
    const location = searchData.locationInput;
    const radius = searchData.radius;
    const input = searchData.searchInput;
    const category = sessionStorage.getItem('fyc-data-category');
    const inputAddress = JSON.parse(sessionStorage.getItem('fyc-address')) || JSON.parse(sessionStorage.getItem('fyc-coords'));
    const lat = inputAddress.lat;
    const lng = inputAddress.lng;
    const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
    const data = {
      location,
      radius,
      coords: `${lat},${lng}`
    };
    console.log(data);
    if(input) {
      data.input = input;
      data.tag = input;
    }
    if(category) {
      data.category = category;
    }
    axios.post(`${baseURL}/recipes/search?page=1`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      const recipes = res.data.payload.data;
      popAllRecipes(recipes);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
};

const loadUserBookmarks = () => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  if (token) {
    axios.get(`${baseURL}/bookmark/${chefID}?page=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      const bookmarkedRecipes = res.data.payload.data;
      localStorage.setItem('fyc-bookmarks', JSON.stringify(bookmarkedRecipes));
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  } else {
    false;
  }
}

const bookmarkRecipe = (e, id) => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  if (token) {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    const bookmarkedRecipes = JSON.parse(localStorage.getItem('fyc-bookmarks'));
    const bookmarkersID = userData._id;
    const recipeID = id;

    if (bookmarkedRecipes === null) {
      const bookmarkId = e.target.dataset.bookmarkId;
      if (!bookmarkId) {
        const data = {
          bookmarkersID,
          recipeID
        }
        axios.post(`${baseURL}/bookmark`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then((res) => {
          console.log(res);
          toastr.success("Recipe bookmarked");
          e.target.dataset.bookmarkId = res.data.payload.data._id;
          e.target.classList.add('liked');
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        });
      } else {
        const data = {
          bookmarkID : bookmarkId
        }
        axios.delete(`${baseURL}/bookmark`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }, data).then((res) => {
          console.log(res);
          toastr.success(res.data.payload.data.message);
          e.target.removeAttribute('data-bookmark-id');
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        }); 
      }
    }else if (bookmarkedRecipes) {
      const bookmarkId = e.target.dataset.bookmarkId;
      if (!bookmarkId) {
        let bookmarkID;
        bookmarkedRecipes.forEach( bookmark => {

          if (bookmark.recipeID === id) {
            bookmarkID = bookmark._id;
          } else {
            false
          }
        })

        if (bookmarkID === undefined) {
          const data = {
            bookmarkersID,
            recipeID
          }
          axios.post(`${baseURL}/bookmark`, data, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }).then((res) => {
            console.log(res);
            toastr.success("Recipe bookmarked");
            e.target.dataset.bookmarkId = res.data.payload.data._id;
          }).catch((err) => {
            if (err.response && err.response.data) {
              toastr.error(err.response.data.error.message);
            } else {
              toastr.error('Something went wrong, please try again');
            }
          });
        } else {
          const data = {
            bookmarkID
          }
          axios.delete(`${baseURL}/bookmark`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }, data).then((res) => {
            console.log(res);
            toastr.success(res.data.payload.data.message);
            e.target.removeAttribute('data-bookmark-id');
          }).catch((err) => {
            if (err.response && err.response.data) {
              toastr.error(err.response.data.error.message);
            } else {
              toastr.error('Something went wrong, please try again');
            }
          });
        }
        console.log(bookmarkID);
      } else {
        const bookmarkId = e.target.dataset.bookmarkId;
        const data = {
          bookmarkID : bookmarkId
        }
        axios.delete(`${baseURL}/bookmark`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }, data).then((res) => {
          console.log(res);
          toastr.success(res.data.payload.data.message);
          e.target.removeAttribute('data-bookmark-id');
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        }); 
      }
    } 
  } else {
    toastr.err("You need to sign in to bookmark a recipe");
  }
}

const recipeContainer = document.querySelector('.recipe-container');
if (recipeContainer) {
  recipeContainer.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('like-icon')) {
      e.stopPropagation();
      bookmarkRecipe(e, id);
    } else {
      loadRecipePage(id);
    }
  })
}

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
    const id = recipe._id;
    const event = window.Event;
    let listItem =  `
    <div class="col-lg-12 col-md-12">
      <div data-id="${id}" class="listing-item-container list-layout" data-marker-id="1">
        <a data-id="${id}" class="listing-item">
          
          <!-- Image -->
          <div data-id="${id}" class="listing-item-image">
            <img data-id="${id}" src="${image}" alt="">
            <span class="tag">${category}</span>
          </div>
          
          <!-- Content -->
          <div data-id="${id}" class="listing-item-content">
            <div data-id="${id}" class="listing-badge now-open">Available</div>

            <div data-id="${id}" class="listing-item-inner">
              <h3 data-id="${id}">${name}</h3>
              <p data-id="${id}">${chefName}<i class="verified-icon"></i></p>
              <p data-id="${id}">${location}</p>
              <div data-id="${id}" class="star-rating" data-rating="3.75">
                <div class="rating-counter">(12 reviews)</div>
              </div>
            </div>

            <span data-id="${id}" class="like-icon"></span>
            <div data-id="${id}" class="listing-item-details">Starting from $${price} per meal</div>

          </div>
        </a>
      </div>
    </div>
    `;
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

}
const loadRecipePage = (id) => {
  localStorage.setItem('fyc-recipe-id', id);
  location.href = '/listings-single-page.html';
}
