const fetchReviewstoChef = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  // const pagination = document.querySelector('.recipe-pagination');
  // let page = 1;
  const data = {
    chefID
  }
  axios.get(`${baseURL}/chef/reviews/${chefID}`, data).then( res => {
    const reviews = res.data.payload.data.data;
    const reviewCount = res.data.payload.data.dataCount;
    popReviews(reviews);
    // if (reviewCount > 0) {paginate(reviewCount);}
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  // pagination.addEventListener('click', (e) => {
  //   const parentNode = document.querySelectorAll('.star-rating');
  //   parentNode.forEach( parent => {
  //     while (parent.firstChild) {
  //       parent.removeChild(parent.firstChild);
  //     }
  //   })
  //   const listingParent = document.querySelector('#listing-reviews');
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
  //     axios
  //       .get(`${baseURL}/chef/reviews/${id}?page=${page}`, data)
  //       .then((res) => {
  //         const reviews = res.data.payload.data.data
  //         console.log(reviews)
  //         popReviews(reviews)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         if (err.response && err.response.data) {
  //           toastr.error(err.response.data.error.message)
  //         } else {
  //           toastr.error('Something went wrong, please try again')
  //         }
  //       })
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
  //     axios
  //       .get(`${baseURL}/chef/reviews/${id}?page=${page}`, data)
  //       .then((res) => {
  //         const reviews = res.data.payload.data.data
  //         popReviews(reviews)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         if (err.response && err.response.data) {
  //           toastr.error(err.response.data.error.message)
  //         } else {
  //           toastr.error('Something went wrong, please try again')
  //         }
  //       })
  //   }
  // })
}

const popReviews = (reviews) => {
  const reviewContainer = document.querySelector('.chef-reviews');
  reviews.forEach(review => {
    const reviewID = review._id;
    fetchReviewReply(reviewID);
    const image = review.reviewersImage;
    const name = review.reviewersName;
    const comment = review.review;
    const stars = review.averageStars;
    const date = new Date(review.created);
    const year = date.getFullYear();
    const num = date.getMonth();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    const month = months[num];
    const formattedDate = `${month} ${year}`;
    reviewContainer.innerHTML += `
    <li>
      <div class="comments listing-reviews reviewsToChef" data-reply="${reviewID}">
        <ul>
          <li>
            <div class="avatar"><img src="${image}" alt="" /></div>
            <div class="comment-content"><div class="arrow-comment"></div>
              <div class="comment-by">${name}<span class="date">${formattedDate}</span>
                <div class="star-rating" data-rating="${stars}"></div>
              </div>
              <p>${comment}</p>
              <!--<a href="#small-dialog" onclick="setReplyData('${reviewID}')" class="rate-review popup-with-zoom-anim"><i class="sl sl-icon-action-undo"></i> Reply to this review</a>-->
            </div>
          </li>
        </ul>
      </div>
    </li>
  `; 
  });

  
	$('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in'
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

const fetchReviewReply = (id) => {

  axios.get(`${baseURL}/reviews/reply/${id}?page=1`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    const replies = res.data.payload.data
    if(replies.length > 0) {
      popReviewReply(replies);
    };
    // const reviews = res.data.payload.data.data;
    // const reviewCount = res.data.payload.data.dataCount;
    // popReviewtoChef(reviews);
    // if (reviewCount > 0) {paginate(reviewCount);}
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}

const popReviewReply = (replies) => {
  let allReviews = document.querySelectorAll('.reviewsToChef');
  allReviews.forEach(review => {
    replies.forEach(reply => {
      const image = reply.repliersImage;
      const name = reply.repliersName;
      const comment = reply.reply;
      const date = new Date(reply.created);
      const year = date.getFullYear();
      const num = date.getMonth();
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
      const month = months[num];
      const formattedDate = `${month} ${year}`;
      let reviewAttr = review.attributes[1].value;
      if (reviewAttr === reply.reviewID){
        console.log('this is where it should be');
        let selectedReview = document.querySelector(`[data-reply = '${reviewAttr}']`);
        selectedReview.children[0].children[0].children[1].innerHTML += `<li>
          <div class="avatar"><img src="${image}" alt="" /></div>
          <div class="comment-content"><div class="arrow-comment"></div>
            <div class="comment-by">${name}<span class="date">${formattedDate}</span>
            </div>
            <p>${comment}</p>
            <a href="#small-dialog" class="rate-review popup-with-zoom-anim"><i class="sl sl-icon-note"></i></i> Edit</a>
            </div>
        </li>`;
      }
    })
  })
}

const setReplyData = (reviewID) => {
  console.log(reviewID);

  sessionStorage.setItem('fyc-replydata', reviewID);
}

const replyReview = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const repliersID = userData._id;
  const reviewID = sessionStorage.getItem('fyc-replydata');
  const reply = document.querySelector('.reply-text');
  if (reply.value != "") {
    const data = {
      reviewID,
      repliersID,
      reply: reply.value
    }
    axios.post(`${baseURL}/reviews/reply`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      console.log(res);
      addReplytoDOM(reply.value);
      reply.value = "";
      toastr.success("Reply sent");
    }).catch((err) => {
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message);
      } else {
        toastr.error('Something went wrong, please try again');
      }
    })
  }
}

const addReplytoDOM = (reply) => {
  const reviewAttr = sessionStorage.getItem('fyc-replydata');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const name = userData.fullname;
  const image = userData.profilePic;
  const date = new Date();
  const year = date.getFullYear();
  const num = date.getMonth();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  const month = months[num];
  const formattedDate = `${month} ${year}`;
  const reviewBody = document.querySelector('.listing-reviews-body');

  let selectedReview = document.querySelector(`[data-reply = '${reviewAttr}']`);
    console.log(selectedReview.children[0].children[0].children[1]);
    selectedReview.children[0].children[0].children[1].innerHTML += `<li>
      <div class="avatar"><img src="${image}" alt="" /></div>
      <div class="comment-content"><div class="arrow-comment"></div>
        <div class="comment-by">${name}<span class="date">${formattedDate}</span>
        </div>
        <p>${reply}</p>
        <a href="#small-dialog" class="rate-review popup-with-zoom-anim"><i class="sl sl-icon-note"></i></i> Edit</a>
        </div>
    </li>`;
}

document.querySelector('.reviewed-chefs').innerHTML = `
<li>
  <div class="comments listing-reviews">
    <ul>
      <li>
        <div class="avatar"><img src="images/reviews-avatar.jpg" alt="" /> </div>
        <div class="comment-content"><div class="arrow-comment"></div>
          <div class="comment-by">Your review <div class="comment-by-listing own-comment">on <a href="#">Tom's Restaurant</a></div> <span class="date">May 2019</span>
            <div class="star-rating" data-rating="4.5"></div>
          </div>
          <p>Commodo est luctus eget. Proin in nunc laoreet justo volutpat blandit enim. Sem felis, ullamcorper vel aliquam non, varius eget justo. Duis quis nunc tellus sollicitudin mauris.</p>
          <a href="#small-dialog" class="rate-review popup-with-zoom-anim"><i class="sl sl-icon-note"></i></i> Edit</a>
        </div>

      </li>
    </ul>
  </div>
</li>

<li>
  <div class="comments listing-reviews">
    <ul>
      <li>
        <div class="avatar"><img src="images/reviews-avatar.jpg" alt="" /> </div>
        <div class="comment-content"><div class="arrow-comment"></div>
          <div class="comment-by">Your review <div class="comment-by-listing own-comment">on <a href="#">Think Coffee</a></div> <span class="date">May 2019</span>
            <div class="star-rating" data-rating="5"></div>
          </div>
          <p>Commodo est luctus eget. Proin in nunc laoreet justo volutpat blandit enim. Sem felis, ullamcorper vel aliquam non, varius eget justo. Duis quis nunc tellus sollicitudin mauris.</p>
          <a href="#small-dialog" class="rate-review popup-with-zoom-anim"><i class="sl sl-icon-note"></i> Edit</a>
        </div>

      </li>
    </ul>
  </div>
</li>
`;

const fetchChefReviewtoChef = () => {
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  // const pagination = document.querySelector('.recipe-pagination');
  // let page = 1;
  const data = {
    chefID
  }
  axios.get(`${baseURL}/chefs/chef-reviews`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res);
    // const reviews = res.data.payload.data.data;
    // const reviewCount = res.data.payload.data.dataCount;
    // popReviewtoChef(reviews);
    // if (reviewCount > 0) {paginate(reviewCount);}
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
  
}

const fetchRecipeReview = (id) => {
  const pagination = document.querySelector('.recipe-pagination')
  let page = 1
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  let chefID = userData._id;
  const data = {
    chefID
  }
  axios
    .get(`${baseURL}/reviews/${id}?page=${page}`, data)
    .then((res) => {
      const reviews = res.data.payload.data.data
      // const reviewCount = res.data.payload.data.dataCount
      popReviews(reviews)
      if (reviewCount > 0) {
        paginate(reviewCount)
      }
    })
    .catch((err) => {
      console.log(err)
      if (err.response && err.response.data) {
        toastr.error(err.response.data.error.message)
      } else {
        toastr.error('Something went wrong, please try again')
      }
    })
  pagination.addEventListener('click', (e) => {
    const parentNode = document.querySelectorAll('.star-rating')
    parentNode.forEach((parent) => {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
      }
    })
    const listingParent = document.querySelector('#listing-reviews')
    listingParent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const pageParent = e.target.parentElement.parentElement.children
    e.preventDefault()
    if (e.target.classList.contains('next')) {
      page
      let curPage, nxtPage
      for (let i = 0; i < pageParent.length; i++) {
        const pageNode = pageParent[i].children[0]
        if (pageNode.classList.contains('current-page')) {
          curPage = i
          const prevPage = parseFloat(pageNode.innerText)
          page = prevPage + 1
        } else {
          false
        }
      }
      nxtPage = curPage + 1
      pageParent[curPage].children[0].classList.remove('current-page')
      pageParent[nxtPage].children[0].classList.add('current-page')
      axios
        .get(`${baseURL}/reviews/${id}?page=${page}`, data)
        .then((res) => {
          const reviews = res.data.payload.data.data
          // console.log(reviews)
          popReviews(reviews)
        })
        .catch((err) => {
          console.log(err)
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message)
          } else {
            toastr.error('Something went wrong, please try again')
          }
        })
    } else {
      for (let i = 0; i < pageParent.length; i++) {
        const pageNode = pageParent[i].children[0]
        if (pageNode.classList.contains('current-page')) {
          pageNode.classList.remove('current-page')
        } else {
          false
        }
      }
      page = e.target.innerText
      e.target.classList.add('current-page')
      axios
        .get(`${baseURL}/reviews/${id}?page=${page}`, data)
        .then((res) => {
          const reviews = res.data.payload.data.data
          popReviews(reviews)
        })
        .catch((err) => {
          console.log(err)
          if (err.response && err.response.data) {
            toastr.error(err.response.data.error.message)
          } else {
            toastr.error('Something went wrong, please try again')
          }
        })
    }
  })
}
