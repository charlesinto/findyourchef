const fetchAllMessages = () => {
  let page = 1;
  const token = sessionStorage.getItem('fyc-token') || localStorage.getItem('fyc-token');
  const userData = JSON.parse(sessionStorage.getItem('fyc-user')) || JSON.parse(localStorage.getItem('fyc-user'));
  const userID = userData._id;
  const data = {
    userID,
  };
  axios.post(`${baseURL}/messages/recent?page=${page}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }).then((res) => {
    console.log(res.data.payload.data);
    // const dashData = res.data.payload.data;
    // popDash(dashData);
  }).catch((err) => {
    if (err.response && err.response.data) {
      toastr.error(err.response.data.error.message);
    } else {
      toastr.error('Something went wrong, please try again');
    }
  });
}
