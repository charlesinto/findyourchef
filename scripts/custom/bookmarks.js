
const loadChefBookmarks = () => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  const pagination = document.querySelector('.recipe-pagination');
  let page = 1;
  axios.get(`${baseURL}/bookmark/chef/${chefID}?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const bookmarks = res.data.payload.data;
    popChefBookmarks(bookmarks);
    // const bookmarks = res.data.payload.data.data;
    // const bookmarkCount = res.data.payload.data.total;
    // popChefBookmarks(bookmarks);
    // paginate(bookmarkCount);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  // pagination.addEventListener('click', (e) => {
  //   const listingParent = document.querySelector('.dashboard-content');
  //   listingParent.scrollIntoView({ behavior: 'smooth', block: 'start'});
  //   const pageParent = e.target.parentElement.parentElement.children;
  //   e.preventDefault();
  //   if (e.target.classList.contains("next")) {
  //     page;
  //     let curPage,nxtPage;
  //     for (let i = 0; i < pageParent.length; i++) {
  //       const pageNode = pageParent[i].children[0];
  //       if (pageNode.classList.contains('current-page')) {
  //         curPage = i;
  //         const prevPage = parseFloat(pageNode.innerText);
  //         page = prevPage + 1;
  //       } else {
  //         false;
  //       }
  //     }
  //     nxtPage = curPage + 1;
  //     pageParent[curPage].children[0].classList.remove('current-page');
  //     pageParent[nxtPage].children[0].classList.add('current-page');
  //     axios.get(`${baseURL}/bookmark/${chefID}?page=${page}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       },
  //     }).then((res) => {
  //       console.log(res.data.payload.data);
  //       const bookmarks = res.data.payload.data;
  //       popChefBookmarks(bookmarks);
  //     }).catch((err) => {
  //       if (err.response && err.response.data) {
  //         toastr.error(err.response.data.error.message);
  //       } else {
  //         toastr.error('Something went wrong, please try again');
  //       }
  //     });
  //   } else {
  //     for (let i = 0; i < pageParent.length; i++) {
  //       const pageNode = pageParent[i].children[0];
  //       if (pageNode.classList.contains('current-page')) {
  //         pageNode.classList.remove('current-page');
  //       } else {
  //         false;
  //       }
  //     }
  //     page = e.target.innerText;
  //     e.target.classList.add('current-page');
  //     axios.get(`${baseURL}/bookmark/${chefID}?page=${page}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       },
  //     }).then((res) => {
  //       console.log(res.data.payload.data);
  //       const bookmarks = res.data.payload.data;
  //       popChefBookmarks(bookmarks);
  //     }).catch((err) => {
  //       if (err.response && err.response.data) {
  //         toastr.error(err.response.data.error.message);
  //       } else {
  //         toastr.error('Something went wrong, please try again');
  //       }
  //     });
  //   }
  // })
}

const popChefBookmarks = (bookmarks) => {
  const bookmarkContainer = document.querySelector('.listing-container');
  bookmarks.forEach(bookmark => {
    const image = bookmark.chefImages[0];
    const name = bookmark.chefName;
    const location = bookmark.location;
    const reviews = bookmark.reviewCount;
    const chefID = bookmark.chefID;
    const bookmarkersID = bookmark.bookmarkersID;
    const event = window.Event;
    bookmarkContainer.innerHTML += `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="images/reviews-avatar.jpg" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3>${name}</h3>
            <span>${location}</span>
            <div class="" data-rating="5.0">
              <div class="rating-counter">(${reviews} reviews)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons-to-right">
        <a href="#" onclick="deleteChefBookmark(event,'${bookmarkersID}','${chefID}')" class="button gray"><i class="sl sl-icon-close"></i> Delete</a>
      </div>
    </li>
  `
  })
  

// /*----------------------------------------------------*/
// /*  Rating Overview Background Colors
// /*----------------------------------------------------*/
// function ratingOverview(ratingElem) {

//   $(ratingElem).each(function() {
//     var dataRating = $(this).attr('data-rating');
//     // Rules
//       if (dataRating >= 4.0) {
//           $(this).addClass('high');
//           $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*100 + "%", });
//       } else if (dataRating >= 3.0) {
//           $(this).addClass('mid');
//           $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*80 + "%", });
//       } else if (dataRating < 3.0) {
//           $(this).addClass('low');
//           $(this).find('.rating-bars-rating-inner').css({ width: (dataRating/5)*60 + "%", });
//       }

//   });
// } ratingOverview('.rating-bars-rating');

// $(window).on('resize', function() {
//   ratingOverview('.rating-bars-rating');
// });


// /*----------------------------------------------------*/
// /*  Ratings Script
// /*----------------------------------------------------*/

// /*  Numerical Script
// /*--------------------------*/
// function numericalRating(ratingElem) {

// 	$(ratingElem).each(function() {
// 		var dataRating = $(this).attr('data-rating');

// 		// Rules
// 	    if (dataRating >= 4.0) {
// 	        $(this).addClass('high');
// 	    } else if (dataRating >= 3.0) {
// 	        $(this).addClass('mid');
// 	    } else if (dataRating < 3.0) {
// 	        $(this).addClass('low');
// 	    }

// 	});

// } numericalRating('.numerical-rating');


// /*  Star Rating
// /*--------------------------*/
// function starRating(ratingElem) {

// 	$(ratingElem).each(function() {

// 		var dataRating = $(this).attr('data-rating');
// 		// Rating Stars Output
// 		function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
// 			return(''+
// 				'<span class="'+firstStar+'"></span>'+
// 				'<span class="'+secondStar+'"></span>'+
// 				'<span class="'+thirdStar+'"></span>'+
// 				'<span class="'+fourthStar+'"></span>'+
// 				'<span class="'+fifthStar+'"></span>');
// 		}

// 		var fiveStars = starsOutput('star','star','star','star','star');

// 		var fourHalfStars = starsOutput('star','star','star','star','star half');
// 		var fourStars = starsOutput('star','star','star','star','star empty');

// 		var threeHalfStars = starsOutput('star','star','star','star half','star empty');
// 		var threeStars = starsOutput('star','star','star','star empty','star empty');

// 		var twoHalfStars = starsOutput('star','star','star half','star empty','star empty');
// 		var twoStars = starsOutput('star','star','star empty','star empty','star empty');

// 		var oneHalfStar = starsOutput('star','star half','star empty','star empty','star empty');
// 		var oneStar = starsOutput('star','star empty','star empty','star empty','star empty');

//     // Rules
//     console.log('dataRating');
//         if (dataRating >= 4.75) {
//             $(this).append(fiveStars);
//         } else if (dataRating >= 4.25) {
//             $(this).append(fourHalfStars);
//         } else if (dataRating >= 3.75) {
//             $(this).append(fourStars);
//             // document.querySelector('.star-rating').innerHTML += fourStars;
//         } else if (dataRating >= 3.25) {
//             $(this).append(threeHalfStars);
//             // document.querySelector('.star-rating').innerHTML += 'threeHalfStars';
//         } else if (dataRating >= 2.75) {
//             $(this).append(threeStars);
//         } else if (dataRating >= 2.25) {
//             $(this).append(twoHalfStars);
//         } else if (dataRating >= 1.75) {
//             $(this).append(twoStars);
//         } else if (dataRating >= 1.25) {
//             $(this).append(oneHalfStar);
//         } else if (dataRating < 1.25) {
//             $(this).append(oneStar);
//         }
// 	});

// } starRating('.star-rating');

}

const deleteChefBookmark = (e, bookmarkersID, chefID) => {
  e.preventDefault();
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    bookmarkersID,
    chefID
  }
  console.log(data);
  axios.delete(`${baseURL}/bookmark/chef`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }, data).then((res) => {
    console.log(res);
    // toastr.success(res.data.payload.data.message);
    e.target.parentElement.parentElement.remove();
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  }); 
}


const loadRecipeBookmarks = () => {
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  const pagination = document.querySelector('.recipe-pagination');
  let page = 1;
  axios.get(`${baseURL}/bookmark/${chefID}?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    const bookmarks = res.data.payload.data;
    popRecipeBookmarks(bookmarks);
    // const bookmarks = res.data.payload.data.data;
    // const bookmarkCount = res.data.payload.data.total;
    // popRecipeBookmarks(bookmarks);
    // paginate(bookmarkCount);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  // pagination.addEventListener('click', (e) => {
  //   const listingParent = document.querySelector('.dashboard-content');
  //   listingParent.scrollIntoView({ behavior: 'smooth', block: 'start'});
  //   const pageParent = e.target.parentElement.parentElement.children;
  //   e.preventDefault();
  //   if (e.target.classList.contains("next")) {
  //     page;
  //     let curPage,nxtPage;
  //     for (let i = 0; i < pageParent.length; i++) {
  //       const pageNode = pageParent[i].children[0];
  //       if (pageNode.classList.contains('current-page')) {
  //         curPage = i;
  //         const prevPage = parseFloat(pageNode.innerText);
  //         page = prevPage + 1;
  //       } else {
  //         false;
  //       }
  //     }
  //     nxtPage = curPage + 1;
  //     pageParent[curPage].children[0].classList.remove('current-page');
  //     pageParent[nxtPage].children[0].classList.add('current-page');
  //     axios.get(`${baseURL}/bookmark/${chefID}?page=${page}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       },
  //     }).then((res) => {
  //       console.log(res.data.payload.data);
  //       const bookmarks = res.data.payload.data;
  //       popRecipeBookmarks(bookmarks);
  //     }).catch((err) => {
  //       if (err.response && err.response.data) {
  //         toastr.error(err.response.data.error.message);
  //       } else {
  //         toastr.error('Something went wrong, please try again');
  //       }
  //     });
  //   } else {
  //     for (let i = 0; i < pageParent.length; i++) {
  //       const pageNode = pageParent[i].children[0];
  //       if (pageNode.classList.contains('current-page')) {
  //         pageNode.classList.remove('current-page');
  //       } else {
  //         false;
  //       }
  //     }
  //     page = e.target.innerText;
  //     e.target.classList.add('current-page');
  //     axios.get(`${baseURL}/bookmark/${chefID}?page=${page}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       },
  //     }).then((res) => {
  //       console.log(res.data.payload.data);
  //       const bookmarks = res.data.payload.data;
  //       popRecipeBookmarks(bookmarks);
  //     }).catch((err) => {
  //       if (err.response && err.response.data) {
  //         toastr.error(err.response.data.error.message);
  //       } else {
  //         toastr.error('Something went wrong, please try again');
  //       }
  //     });
  //   }
  // })
}

const popRecipeBookmarks = (bookmarks) => {
  const bookmarkContainer = document.querySelector('.listing-container');
  bookmarks.forEach(bookmark => {
    const image = bookmark.recipesImage[0];
    const name = bookmark.recipeName;
    const location = bookmark.location;
    const reviews = bookmark.reviewCount;
    const bookmarkID = bookmark._id;
    const event = window.Event;
    bookmarkContainer.innerHTML += `
    <li>
      <div class="list-box-listing">
        <div class="list-box-listing-img"><a href="#"><img src="${image}" alt=""></a></div>
        <div class="list-box-listing-content">
          <div class="inner">
            <h3>${name}</h3>
            <span>${location}</span>
            <div class="star-rating" data-rating="5.0">
              <div class="rating-counter">(${reviews} reviews)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttons-to-right">
        <a href="#" onclick="deleteBookmark(event, '${bookmarkID}')" class="button gray"><i class="sl sl-icon-close"></i> Delete</a>
      </div>
    </li>
  `
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

}

const deleterecipeBookmark = (e, bookmarkID) => {
  e.preventDefault();
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const data = {
    bookmarkID
  }
  axios.delete(`${baseURL}/bookmark?chef`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }, data).then((res) => {
    console.log(res);
    toastr.success(res.data.payload.data.message);
    e.target.parentElement.parentElement.remove();
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  }); 
}

//BOOKMARK CHEF ON THE CHEF-DETAILS CHEF
const bookmark = document.querySelector('.like-button')
if (bookmark) {
  bookmark.addEventListener('click', (e) => {
    e.preventDefault()
    const token =
      localStorage.getItem('fyc-token') || sessionStorage.getItem('fyc-token')
    if (token) {
      const userData =
        JSON.parse(sessionStorage.getItem('fyc-user')) ||
        JSON.parse(localStorage.getItem('fyc-user'))
      const bookmarkersID = userData._id
      const chefID = localStorage.getItem('fyc-recipe-id')
      const data = {
        bookmarkersID,
        chefID,
      }
      console.log(data)
      if (localStorage.getItem('fyc-bookmark-id') === null) {
        axios
          .post(`${baseURL}/bookmark/chef`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log(res)
            toastr.success('Chef bookmarked')
            localStorage.setItem('fyc-bookmark-id', res.data.payload.data._id)
          })
          .catch((err) => {
            if (err.response && err.response.data) {
              toastr.error(err.response.data.error.message)
            } else {
              toastr.error('Something went wrong, please try again')
            }
          })
      } else if (localStorage.getItem('fyc-bookmark-id') !== null) {
        const bookmarkersID = userData._id
        const chefID = localStorage.getItem('fyc-recipe-id')
        const data = {
          bookmarkersID,
          chefID,
        }
        console.log(data)
        axios
          .delete(`${baseURL}/bookmark/chef`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data,
          })
          .then((res) => {
            console.log(res)
            toastr.success('chef bookmark deleted')
            localStorage.removeItem('fyc-bookmark-id')
          })
          .catch((err) => {
            if (err.response && err.response.data) {
              toastr.error(err.response.data.error.message)
            } else {
              toastr.error('Something went wrong, please try again')
            }
          })
      }
    }
  })
}