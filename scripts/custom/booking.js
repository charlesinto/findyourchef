$(function () {
  console.log(sessionStorage.getItem("fyc-token"));
  console.log(JSON.parse(sessionStorage.getItem("fyc-user")));
  getBookings();
});
// let baseURL = "https://thepotters-api.herokuapp.com/api/v1";
const getBookings = async () => {
  try {
    const response = await axios.post(
      `https://thepotters-api.herokuapp.com/api/v1/chef/bookings`
    );
  } catch (error) {
    console.log(error);
  }
};
