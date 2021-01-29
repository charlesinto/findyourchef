// const baseURL = 'https://thepotters-api.herokuapp.com/api/v1';
const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
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