/* VIEW CHEF */
const loadAllRecipes = () => {
  const searchData = JSON.parse(sessionStorage.getItem('fyc-search'));
  const pagination = document.querySelector('.recipe-pagination');
  let page = 1;
  /* VIEW ALL CHEF */

  if (searchData === null) {
    axios.get(`${baseURL}/chefs?page=${page}`).then((res) => {
      console.log(res);
      const recipes = res.data.payload.data.data;
      console.log(recipes);
      const recipeCount = res.data.payload.data.dataCount;
      popAllChefs(recipes);
      paginate(recipeCount);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
    pagination.addEventListener('click', (e) => {
      const listingParent = document.querySelector('.fs-content');
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
        axios.get(`${baseURL}/chefs?page=${page}`).then((res) => {
          console.log(res.data.payload.data);
          const recipes = res.data.payload.data.data;
          popAllChefs(recipes);
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
        axios.get(`${baseURL}/chefs?page=${page}`).then((res) => {
          const recipes = res.data.payload.data.data;
          popAllChefs(recipes);
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        });
      }
    })
  } else {
    /* VIEW SEARCHED CHEFS */
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
    axios.post(`${baseURL}/recipes/search?page=${page}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      const recipes = res.data.payload.data.data;
      const recipeCount = res.data.payload.data.dataCount;
      popAllChefs(recipes);
      paginate(recipeCount);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
    pagination.addEventListener('click', (e) => {
      const listingParent = document.querySelector('.fs-content');
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
        axios.get(`${baseURL}/recipes/search?page=${page}`).then((res) => {
          console.log(res.data.payload.data);
          const recipes = res.data.payload.data.data;
          popAllChefs(recipes);
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
        e.target.classList.add('current-pag e');
        axios.get(`${baseURL}/chefs/search?page=${page}`).then((res) => {
          console.log(res.data.payload.data);
          const recipes = res.data.payload.data.data;
          popAllChefs(recipes);
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        });
      }
    })
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

// const bookmarkRecipe = (e, id) => {
//   const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
//   if (token) {
//     const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
//     const bookmarkedRecipes = JSON.parse(localStorage.getItem('fyc-bookmarks'));
//     const bookmarkersID = userData._id;
//     const recipeID = id;

//     if (bookmarkedRecipes === null) {
//       const bookmarkId = e.target.dataset.bookmarkId;
//       if (!bookmarkId) {
//         const data = {
//           bookmarkersID,
//           recipeID
//         }
//         axios.post(`${baseURL}/bookmark`, data, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           },
//         }).then((res) => {
//           console.log(res);
//           toastr.success("Recipe bookmarked");
//           e.target.dataset.bookmarkId = res.data.payload.data._id;
//           e.target.classList.add('liked');
//         }).catch((err) => {
//           if (err.response && err.response.data) {
//             toastr.error(err.response.data.error.message);
//           } else {
//             toastr.error('Something went wrong, please try again');
//           }
//         });
//       } else {
//         const data = {
//           bookmarkersID,
//           recipeID
//         }
//         axios.delete(`${baseURL}/bookmark`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//         }, data).then((res) => {
//           console.log(res);
//           toastr.success(res.data.payload.data.message);
//           e.target.removeAttribute('data-bookmark-id');
//         }).catch((err) => {
//           if (err.response && err.response.data) {
//             toastr.error(err.response.data.error.message);
//           } else {
//             toastr.error('Something went wrong, please try again');
//           }
//         }); 
//       }
//     }else if (bookmarkedRecipes) {
//       const bookmarkId = e.target.dataset.bookmarkId;
//       if (!bookmarkId) {
//         let bookmarkID;
//         bookmarkedRecipes.forEach( bookmark => {

//           if (bookmark.recipeID === id) {
//             bookmarkID = bookmark._id;
//           } else {
//             false
//           }
//         })

//         if (bookmarkID === undefined) {
//           const data = {
//             bookmarkersID,
//             recipeID
//           }
//           axios.post(`${baseURL}/bookmark`, data, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             },
//           }).then((res) => {
//             console.log(res);
//             toastr.success("Recipe bookmarked");
//             e.target.dataset.bookmarkId = res.data.payload.data._id;
//           }).catch((err) => {
//             if (err.response && err.response.data) {
//               toastr.error(err.response.data.error.message);
//             } else {
//               toastr.error('Something went wrong, please try again');
//             }
//           });
//         } else {
//           console.log(bookmarkID);
//           const data = {
//             bookmarkersID,
//             recipeID
//           }
//           axios.delete(`${baseURL}/bookmark`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             },
//           }, data).then((res) => {
//             console.log(res);
//             toastr.success(res.data.payload.data.message);
//             e.target.removeAttribute('data-bookmark-id');
//           }).catch((err) => {
//             if (err.response && err.response.data) {
//               toastr.error(err.response.data.error.message);
//             } else {
//               toastr.error('Something went wrong, please try again');
//             }
//           });
//         }
//       } else {
//         // const bookmarkId = e.target.dataset.bookmarkId;
//         const data = {
//           bookmarkersID,
//           recipeID
//         }
//         axios.delete(`${baseURL}/bookmark`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//         }, data).then((res) => {
//           console.log(res);
//           toastr.success(res.data.payload.data.message);
//           e.target.removeAttribute('data-bookmark-id');
//         }).catch((err) => {
//           if (err.response && err.response.data) {
//             toastr.error(err.response.data.error.message);
//           } else {
//             toastr.error('Something went wrong, please try again');
//           }
//         }); 
//       }
//     } 
//   } else {
//     toastr.err("You need to sign in to bookmark a recipe");
//   }
// }


const recipeContainer = document.querySelector('.recipe-container');
if (recipeContainer) {
  recipeContainer.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('like-icon')) {
      e.stopPropagation();
      bookmarkChef(e, id);
    } else {
      loadChefPage(id);
    }
  })
}

const popAllChefs = (recipes) => {
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
    console.log(recipe);
    const name = recipe.fullname;
    const category = recipe.categories;
    const chefName = recipe.chefName;
    const image = recipe.images[1];
    const price = recipe.price;
    const location = recipe.coords;
    const notes = recipe.notes;
    const id = recipe._id;
    const event = window.Event;
    let listItem = `
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
              <p data-id="${id}">${name}<i class="verified-icon"></i></p>
              <p data-id="${id}"><i class="fa fa-map-marker"></i> ${location}</p>
              <p data-id="${id}">${notes}</p>
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

}
