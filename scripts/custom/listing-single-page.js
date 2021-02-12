// const baseURL = 'https://thepotters-api.herokuapp.com/api/v1';
const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
let star, length;

/* FETCH RECIPE DATA */
const fetchRecipeData = () => {
  const id = localStorage.getItem('fyc-recipe-id');
  axios.get(`${baseURL}/recipes/${id}`).then((res) => {
    const recipe = res.data.payload.data.data;
    const stars = res.data.payload.data.stars;
    console.log(res.data.payload.data);
    sessionStorage.setItem('fyc-recipe-chefID', recipe.chefID);
    popRecipeData(recipe, stars);
    fetchRecipeReview(id);
  }).catch((err) => {
    console.log(err);
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}


	/*----------------------------------------------------*/
	/*  Inline CSS replacement for backgrounds etc.
	/*----------------------------------------------------*/
	function inlineCSS() {

		// Common Inline CSS
		$(".main-search-container, section.fullwidth, .listing-slider .item, .listing-slider-small .item, .address-container, .img-box-background, .image-edge, .edge-bg").each(function() {
			var attrImageBG = $(this).attr('data-background-image');
			var attrColorBG = $(this).attr('data-background-color');

	        if(attrImageBG !== undefined) {
	            $(this).css('background-image', 'url('+attrImageBG+')');
	        }

	        if(attrColorBG !== undefined) {
	            $(this).css('background', ''+attrColorBG+'');
	        }
		});

	}


/* POPULATE DOM WITH RECIPE DATA */
const popRecipeData = (data, stars) => {
  const name = data.name;
  const chefName = data.chefName;
  const image = data.image;
  const price = data.price;
  const category = data.category;
  const location = data.location;
  const tags = data.tags;
  const overview = data.overview;
  const availability = data.availability;
  sessionStorage.setItem('fyc-availability', JSON.stringify(availability))
  const phone = data.chefNumber;
  const email = data.chefEmail;
  const slider = document.querySelector('.listing-slider');
  slider.innerHTML = `
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 1"></a>
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 3"></a>
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 2"></a>
                  <a href="${image}" data-background-image="${image}" class="item mfp-gallery" title="Title 4"></a>
                  `;
  

                  $('.listing-slider').slick({
                    centerMode: true,
                    centerPadding: '20%',
                    slidesToShow: 2,
                    responsive: [
                      {
                        breakpoint: 1367,
                        settings: {
                          centerPadding: '15%'
                        }
                      },
                      {
                        breakpoint: 1025,
                        settings: {
                          centerPadding: '0'
                        }
                      },
                      {
                        breakpoint: 767,
                        settings: {
                          centerPadding: '0',
                          slidesToShow: 1
                        }
                      }
                    ]
                  });
                  inlineCSS();
  const titlebarTitle = document.querySelector('.listing-titlebar-title');
  titlebarTitle.innerHTML = `
                          <div class="listing-titlebar-title">
                            <h2>${name}<span class="listing-tag">${category}</span></h2>
                            <span>
                              <a href="#listing-location" class="listing-address">
                                <i class="fa fa-map-marker"></i>
                                ${location}
                              </a>
                            </span>
                            <div class="star-rating" data-rating="${stars.averageStars}">
                              <div class="rating-counter"><a href="#listing-reviews">(31 reviews)</a></div>
                            </div>
                          </div>
  `;
  const listingOverview = document.querySelector('#listing-overview');
  listingOverview.innerHTML = `
  
                            <p>
                            ${overview}
                          </p>
                          <div class="clearfix"></div>

                          <h3 class="listing-desc-headline">Tags</h3>
                          <ul class="listing-features checkboxes margin-top-0">
                          </ul>
  `;
  const listingFeatures = document.querySelector('.listing-features');
  tags.forEach(tag => {
    listingFeatures.innerHTML += `<li>${tag}</li>`;
  })
  const hostedTitle = document.querySelector('.hosted-by-title');
  hostedTitle.innerHTML = `
                        <h4><span>Recipe by</span> <a href="pages-user-profile.html">${chefName}</a></h4>
                        <a href="pages-user-profile.html" class="hosted-by-avatar"><img src="" alt=""></a>
  `;
  const listingDetails = document.querySelector('.listing-details-sidebar');
  listingDetails.innerHTML = `
                          <li><i class="sl sl-icon-phone"></i>${phone}</li>
                          <li><i class="fa fa-envelope-o"></i> <a href="#">${email}</a></li>
  `;
  const dollarSign = document.querySelector('.bsf-left');
  dollarSign.innerHTML = `
                      <h4>Starting from $${price}</h4>
                      <div class="star-rating" data-rating="${stars.averageStars}">
                        <div class="rating-counter"></div>
                      </div>
  `;
  const star = Math.round((parseFloat(stars.averageStars) + Number.EPSILON) * 10) / 10;
  const overviewBox = document.querySelector('.rating-overview-box');
  overviewBox.innerHTML = 
  `<span class="rating-overview-box-total">${star}</span>
  <span class="rating-overview-box-percent">out of 5.0</span>
  <div class="star-rating" data-rating="${star}"></div>`;
  const serviceStar = Math.round((parseFloat(stars.serviceStars) + Number.EPSILON) * 10) / 10;
  const locationStar = Math.round((parseFloat(stars.locationStars) + Number.EPSILON) * 10) / 10;
  const valueStar = Math.round((parseFloat(stars.valueStars) + Number.EPSILON) * 10) / 10;
  const cleanlinessStar = Math.round((parseFloat(stars.cleanlinessStars) + Number.EPSILON) * 10) / 10;
  document.querySelector('.rating-bars').innerHTML = `<div class="rating-bars-item">
  <span class="rating-bars-name">Service <i class="tip" data-tip-content="Quality of customer service and attitude to work with you"></i></span>
  <span class="rating-bars-inner">
    <span class="rating-bars-rating" data-rating="${serviceStar}">
      <span class="rating-bars-rating-inner"></span>
    </span>
    <strong>${serviceStar}</strong>
  </span>
</div>
<div class="rating-bars-item">
  <span class="rating-bars-name">Value for Money <i class="tip" data-tip-content="Overall experience received for the amount spent"></i></span>
  <span class="rating-bars-inner">
    <span class="rating-bars-rating" data-rating="${valueStar}">
      <span class="rating-bars-rating-inner"></span>
    </span>
    <strong>${valueStar}</strong>
  </span>
</div>
<div class="rating-bars-item">
  <span class="rating-bars-name">Location <i class="tip" data-tip-content="Visibility, commute or nearby parking spots"></i></span>
  <span class="rating-bars-inner">
    <span class="rating-bars-rating" data-rating="${locationStar}">
      <span class="rating-bars-rating-inner"></span>
    </span>
    <strong>${locationStar}</strong>
  </span>
</div>
<div class="rating-bars-item">
  <span class="rating-bars-name">Cleanliness <i class="tip" data-tip-content="The physical condition of the business"></i></span>
  <span class="rating-bars-inner">
    <span class="rating-bars-rating" data-rating="${cleanlinessStar}">
      <span class="rating-bars-rating-inner"></span>
    </span>
    <strong>${cleanlinessStar}</strong>
  </span>
</div>`;
  
  
  
  
}

const fetchRecipeReview = (id) => {
  const pagination = document.querySelector('.review-pagination');
  let page = 1;
  const data = {
    recipeID : id
  }
  axios.get(`${baseURL}/reviews/${id}?page=${page}`, data).then( res => {
    const reviews = res.data.payload.data.data;
    const reviewCount = res.data.payload.data.dataCount;
    popReviews(reviews);
    paginate(reviewCount);
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  pagination.addEventListener('click', (e) => {
    const parentNode = document.querySelectorAll('.star-rating');
    parentNode.forEach( parent => {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    })
    const listingParent = document.querySelector('#listing-reviews');
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
      axios.get(`${baseURL}/reviews/${id}?page=${page}`, data).then( res => {
        const reviews = res.data.payload.data.data;
        console.log(reviews);
        popReviews(reviews);
      }).catch((err) => {
        console.log(err)
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
      axios.get(`${baseURL}/reviews/${id}?page=${page}`, data).then( res => {
        const reviews = res.data.payload.data.data;
        popReviews(reviews);
      }).catch((err) => {
        console.log(err)
        if (err.response && err.response.data) {
          toastr.error(err.response.data.error.message);
        } else {
          toastr.error('Something went wrong, please try again');
        }
      });
    }
  })
}

const paginate = (count) => {
  const pageContainer = document.querySelector('.review-pagination');
  pageContainer.innerHTML = `<li><a href="#" class="current-page">1</a></li>`;
  const pages = Math.ceil(count / 10);
  for (let i = 2; i <= pages; i++) {
    pageContainer.innerHTML += `<li><a href="#">${i}</a></li>`;
  }
  pageContainer.innerHTML += `<li><a class="next" href="#"><i id="next" class="next sl sl-icon-arrow-right"></i></a></li>`;
}


const popReviews = (reviews) => {
  length = reviews.length;
  const review_count = document.querySelector('.pop-review-count');
  review_count.innerText = `(${length})`;
  const reviewBody = document.querySelector('.listing-reviews-body');
  reviewBody.innerHTML = "";
  let starCount = 0;
  reviews.forEach(review => {
    const image = review.reviewersImage;
    const name = review.reviewersName;
    const recipeImage = review.recipesImage[0];
    const comment = review.review;
    const stars = review.averageStars;
    const date = new Date(review.created);
    const year = date.getFullYear();
    const num = date.getMonth();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    const month = months[num];
    const formattedDate = `${month} ${year}`;
    starCount += stars;
    reviewBody.innerHTML += `
            <li>
							<div class="avatar"><img src="${image}" alt="" /></div>
							<div class="comment-content"><div class="arrow-comment"></div>
								<div class="comment-by">${name}<i class="tip" data-tip-content="Person who left this review actually was a customer"></i> <span class="date">${formattedDate}</span>
									<div class="star-rating" data-rating="${stars}"></div>
								</div>
								<p>${comment}</p>
								
								<div class="review-images mfp-gallery-container">
									<a href="${recipeImage}" class="mfp-gallery"><img src="${recipeImage}" alt=""></a>
								</div>
								<a href="#" class="rate-review"><i class="sl sl-icon-like"></i> Helpful Review <span>12</span></a>
							</div>
						</li>
    `;
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

const addReviewToDOM = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  length += 1;
  const parentNode = document.querySelectorAll('.star-rating');
  parentNode.forEach( parent => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  })
  const review_count = document.querySelector('.pop-review-count');
  review_count.innerText = `(${length})`;
  const name = userData.fullname;
  const image = userData.image;
  const date = new Date();
  const year = date.getFullYear();
  const num = date.getMonth();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  const month = months[num];
  const formattedDate = `${month} ${year}`;
  const review = document.querySelector('.review-area').value;
  const stars = (serviceStars + valueStars + cleanlinessStars + locationStars) / 4;
  const recipeImage = document.querySelector('.uploadButton-input').value;
  const reviewBody = document.querySelector('.listing-reviews-body');
  reviewBody.innerHTML += `
  <li>
    <div class="avatar"><img src="${image}" alt="" /></div>
    <div class="comment-content"><div class="arrow-comment"></div>
      <div class="comment-by">${name}<i class="tip" data-tip-content="Person who left this review actually was a customer"></i> <span class="date">${formattedDate}</span>
        <div class="star-rating" data-rating="${stars}"></div>
      </div>
      <p>${review}</p>
      
      <div class="review-images mfp-gallery-container">
        <a href="${recipeImage}" class="mfp-gallery"><img src="${recipeImage}" alt=""></a>
      </div>
      <a href="#" class="rate-review"><i class="sl sl-icon-like"></i> Helpful Review <span>12</span></a>
    </div>
  </li>
  `;
  
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

const ratingContainer = document.querySelector('.sub-ratings-container');
let rating, serviceStars, valueStars, cleanlinessStars, locationStars;
if (ratingContainer) {
  const ratingService = document.querySelector('.service-rating');
  ratingService.addEventListener('click', (e) => {
    if (e.target.type === 'radio') {
      const rateObj = {
        5 : 1,
        4 : 2,
        3 : 3,
        2 : 4,
        1 : 5
      }
      const rateVal = e.target.value;
      serviceStars = rateObj[rateVal];
    }
  })
  const ratingMoney = document.querySelector('.money-rating');
  ratingMoney.addEventListener('click', (e) => {
    if (e.target.type === 'radio') {
      const rateObj = {
        5 : 1,
        4 : 2,
        3 : 3,
        2 : 4,
        1 : 5
      }
      const rateVal = e.target.value;
      valueStars = rateObj[rateVal];
    }
  })
  const ratingLocation = document.querySelector('.location-rating');
  ratingLocation.addEventListener('click', (e) => {
    if (e.target.type === 'radio') {
      const rateObj = {
        5 : 1,
        4 : 2,
        3 : 3,
        2 : 4,
        1 : 5
      }
      const rateVal = e.target.value;
      locationStars = rateObj[rateVal];
    }
  })
  const ratingClean = document.querySelector('.clean-rating');
  ratingClean.addEventListener('click', (e) => {
    if (e.target.type === 'radio') {
      const rateObj = {
        5 : 1,
        4 : 2,
        3 : 3,
        2 : 4,
        1 : 5
      }
      const rateVal = e.target.value;
      cleanlinessStars = rateObj[rateVal];
    }
  })
}


const postReview = (e) => {
  e.preventDefault();
  const recipeID = localStorage.getItem('fyc-recipe-id');
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  if (!token) {
    toastr.error("You need to be signed in to be able to drop a review");
  } else {
    const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
    let reviewersID = userData._id;
    const review = document.querySelector('.review-area').value;
    // const stars = (serviceRate + moneyRate + cleanRate) / 3;

    
   
    const data = {
      reviewersID,
      recipeID,
      review,
      serviceStars,
      locationStars,
      valueStars,
      cleanlinessStars
    };
    axios.post(`${baseURL}/reviews`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      addReviewToDOM();
      toastr.success(res.data.payload.data.message);
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    });
  }
}

const bookmark = document.querySelector('.like-button');
if (bookmark) {
  bookmark.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fyc-token');
    if (token) {
      const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
      const bookmarkersID = userData._id;
      const recipeID = localStorage.getItem('fyc-recipe-id');
      const data = {
        bookmarkersID,
        recipeID
      }
      if (localStorage.getItem('fyc-bookmark-id') === null) {
        axios.post(`${baseURL}/bookmark`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then((res) => {
          console.log(res);
          toastr.success("Recipe bookmarked");
          localStorage.setItem('fyc-bookmark-id', res.data.payload.data._id);
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        });
      } else {
        const bookmarkID = localStorage.getItem('fyc-bookmark-id');
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
          localStorage.removeItem('fyc-bookmark-id');
        }).catch((err) => {
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message);
          } else {
            toastr.error('Something went wrong, please try again');
          }
        });   
      }
    }
  })
}

const popAvailability = () => {
  const availability = JSON.parse(sessionStorage.getItem('fyc-availability'));
  const weekDay = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const picker = document.querySelector('#date-picker').value;
  const date = new Date(picker).getDay();
  const day = weekDay[date];
  const daySlots = availability[day];
  const panel = document.querySelector('.panel-dropdown-scrollable');
  panel.innerHTML = '';
  // const display = document.querySelector('.final-display');
  let output;
  daySlots.forEach( time => {
    const id = time.id;
    if(time.startHours > 12) {
      time.startHours = time.startHours%12;
      output = `${time.startHours}:${time.startMinutes} pm - `;
    } else {
      output = `${time.startHours}:${time.startMinutes} am - `;
    }
    if(time.endHours > 12) {
      time.endHours = time.endHours%12;
      output += `${time.endHours}:${time.endMinutes} pm`;
    } else {
      output += `${time.endHours}:${time.endMinutes} am`;
    }
    panel.innerHTML += `									
    <!-- Time Slot -->
    <div class="time-slot">
      <input type="radio" name="time-slot" id="time-slot-1">
      <label for="time-slot-1">
        <strong id="${id}">${output}</strong>
        <span>1 slot available</span>
      </label>
    </div>
    `;
  });
}

const dropdown = document.querySelector('.panel-dropdown-content');
const dropPanel = document.querySelector('.panel-dropdown');
dropPanel.addEventListener('click', (e) => {
  e.preventDefault();
  dropdown.classList.remove('display-none');
})
dropdown.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.hasAttribute('for')) {
    const timing = e.target.children[0].innerText;
    document.querySelector('.final-display').innerText = timing;
    const id = e.target.children[0].id;
    console.log(id);
    dropdown.classList.add('display-none');
    sessionStorage.setItem('fyc-book-id', id);
    close_panel_dropdown();
  }
})

$(".time-slot").each(function() {
	var timeSlot = $(this);
	$(this).find('input').on('change',function() {
		var timeSlotVal = timeSlot.find('strong').text();
    console.log(timeSlotVal);
		$('.panel-dropdown.time-slots-dropdown a').html(timeSlotVal);
		$('.panel-dropdown').removeClass('active');
	});
});

function close_panel_dropdown() {
  $('.panel-dropdown').removeClass("active");
  $('.fs-inner-container.content').removeClass("faded-out");
  }


const bookRecipe = (e) => {
  e.preventDefault();
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  if (userData.role === 'chef') {
    toastr.error("You need a user account before booking a recipe");
  }
  else {
    const bookersID = userData._id;
    const amount = document.querySelector('.qtyTotal').innerText;
    const slotID = sessionStorage.getItem('fyc-book-id');
    const recipeID = localStorage.getItem('fyc-recipe-id');
    const success_url = "http://www.thepottersmind.com/fyc/payment_success.html";
    const cancel_url = "http://www.thepottersmind.com/fyc/payment_failure.html";
    const data = {
      bookersID,
      recipeID,
      amount,
      slotID,
      success_url,
      cancel_url
    }
    console.log(data);
    axios.post(`${baseURL}/recipe/book`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      const paymentID = res.data.payload.data.id;
      console.log(paymentID);
      var stripe = Stripe("pk_test_51I1DVaBUbM1BcmYudXugXJGteb66XL2NS7IMWHRDCLcNwWbwdOgJJD4b1hyo2DUaNgH4HxGn5RamRO4djeX4usXg00rM6sJg8k");
      return stripe.redirectToCheckout({ sessionId: paymentID });
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    })
  }
}