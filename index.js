// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);
  
  fetchCoordsByIP(ip,(error,data) => {
    if (error){
      console.log("It didn't work!" , error);
      return;
    }
    console.log('It worked! Returned coordinates:', data);
    fetchISSFlyOverTimes(data,(error,newData) => {
      if (error){
        console.log("It didn't work!" , error);
        return;
      }
      console.log('It worked! Returned flyover times:', newData);
      
    });
  });
  
});
