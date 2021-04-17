/*******************************
 * Login Form Validation
 ********************************/
const validateLoginForm = () => {
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const button = document.querySelector('#login-btn');
  // Initially disable the button
  if (email.length < 1 || password.length < 1) {
    console.log('object');
    button.setAttribute('disabled', true);
  }

  const fields = [
    document.querySelector('#email'),
    document.querySelector('#password'),
  ];
  fields.forEach((field) => {
    field.addEventListener('input', (el) => {
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      if (email && password) {
        button.removeAttribute('disabled');
      }
    });
  });
};

/*******************************
 * End of Login Form Validation
 ********************************/

/*******************************
 * Signup Form Validation
 ********************************/

const validateSignupForm = () => {
  const fullName = document.querySelector('#name');
  const email = document.querySelector('#email2');
  const username = document.querySelector('#username2');
  const password = document.querySelector('#password1');
  const phone = document.querySelector('#number');
  const button = document.querySelector('#signup-btn');

  // Initially disable the button
  if (
    fullName.value.length < 1 ||
    email.value.length < 1 ||
    username.value.length < 1 ||
    password.value.length < 1 ||
    phone.value.length < 1
  ) {
    button.setAttribute('disabled', true);
  }

  const fields = [fullName, email, username, password, phone];

  fields.forEach((field) => {
    field.addEventListener('input', (el) => {
      if (
        fullName.value &&
        email.value &&
        username.value &&
        password.value &&
        phone.value
      ) {
        button.removeAttribute('disabled');
      }
    });
  });

  // Format phone number as you type
  // phone.addEventListener('input', (e) => {
  //   phone.value = new libphonenumber.AsYouType('US').input(e.target.value);
  // });
};

const validateOTPForm = () => {
  const otp = document.querySelector('#otp');
  const button = document.querySelector('#otp-btn');

  // Initially disable the button
  if (otp.value.length < 1) {
    button.setAttribute('disabled', true);
  }

  otp.addEventListener('input', (e) => {
    if (!e.target.value) {
      button.removeAttribute('disabled');
    }
  });
};

/*******************************
 * End of Signup Form Validation
 ********************************/


/*******************************
 * Add Recipe Form Validation
 ********************************/

const validateAddRecipeForm = () => {
  const name = document.querySelector('#recipe-title')
  const keywords = document.querySelector('#keywords')
  const overview = document.querySelector('#summary')
  const button = document.querySelector('#post-recipe');
  // const pricingTable = document.querySelector('.ui-sortable').children;
  // const pricing = pricingTable[0].children[0].children[4].children[1];
  // console.log(pricingTable);
  // Initially disable the button
  if (
    name.value.length < 1 ||
    keywords.value.length < 1 ||
    overview.value.length < 1 //||
    // pricing.value.length < 1
  ) {
    button.setAttribute('disabled', true);
  }

  const fields = [name, keywords, overview, /*pricing*/];

  fields.forEach((field) => {
    field.addEventListener('input', (el) => {
      if (
        name.value &&
        keywords.value &&
        overview.value /*&&
        pricing.value*/
      ) {
        button.removeAttribute('disabled');
      }
    });
  });

  // Format phone number as you type
  // phone.addEventListener('input', (e) => {
  //   phone.value = new libphonenumber.AsYouType('US').input(e.target.value);
  // });
};

/*******************************
 * End of Add Recipe Form Validation
 ********************************/


const { pathname } = location;
if (pathname === '/login.html') {
  validateLoginForm();
} else if (pathname === '/signup.html' || pathname === '/become-a-chef/onboard.html') {
  validateSignupForm();
  // validateOTPForm();
} else if (pathname === '/dashboard-add-listing.html') {
  validateAddRecipeForm();
}
