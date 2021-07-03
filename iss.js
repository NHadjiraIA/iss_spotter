// /**      ISS
//  * Makes a single API request to retrieve the user's IP address.
//  * Input:
//  *   - A callback (to pass back an error or the IP string)
//  * Returns (via Callback):
//  *   - An error, if any (nullable)
//  *   - The IP address as a string (null if error). Example: "162.245.144.188"
//  */
 const { Console } = require('console');
const request = require('request');

 var url = "https://api.ipify.org?format=json"; 
 var urlIp = "https://freegeoip.app/json/"
 var testUrlForInvalidIp = "https://freegeoip.app/json/invalidIPHere";
 var urlLocation = "http://api.open-notify.org/iss-pass.json"
 
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(url,(error,response,body) =>{ 
    if (error) {
        callback(error, null);
        return;
    }
      // if non-200 status, assume server error
    if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP : ${body}`;
        callback(Error(msg), null);
        return;
    } 
      const ip = JSON.parse(body).ip;
      callback(null, ip);
      return;
  });
};
const fetchCoordsByIP = function(ip, callback) {
  let newUrl = urlIp+ip;
  let result = {
    "latitude": '',
    "longitude":''
  }

  request(newUrl,(error,response,body) =>{
    let errorResult = {
      "status":'error',
      "errors":[{"code":response.statusCode,"message":"Passed IP parameter is incorrect","numberErrors":1}]
    }
    if (error) {
    
      callback(error, null);
      return;
    }
    // if 404 status, assume server error
    if (response.statusCode !== 200) {
      //errorResult ["errors"]["code"]="404";
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response:  ` ;
      const errorMessage = msg + JSON.stringify(errorResult); 
      callback(Error(errorMessage), null); 
      return;
    } 
    const myLatitude = JSON.parse(body).latitude;
    const myLongitude = JSON.parse(body).longitude;
    result["latitude"]=myLatitude;
    result["longitude"] = myLongitude;
    loc = result;
    callback(null, loc);
    return ;
  });
};

const fetchISSFlyOverTimes = function (loc, callback) {
  let newurlLocation = urlLocation+'?lat='+loc["latitude"]+'&lon='+loc["longitude"];
  request(newurlLocation,(error,response,body) =>{
            
    if (error) {                              
     callback(error, null);
     return;
    }
    // if 404 status, assume server error
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const result = JSON.parse(body).response;  
    let nextPasses = result;
    callback(null, nextPasses);
    return;
  }); 
}; 

 
const nextISSTimesForMyLocation = function(callback) {
 fetchMyIP((error, ip) => {
   if (error) {
     return callback(error, null);
   }

   fetchCoordsByIP(ip, (error, loc) => {
     if (error) {
       return callback(error, null);
     }

     fetchISSFlyOverTimes(loc, (error, nextPasses) => {
       if (error) {
         return callback(error, null);
       }

       callback(null, nextPasses);
     });
   });
 });
};

// Only export nextISSTimesForMyLocation and not the other three (API request) functions..
module.exports = { nextISSTimesForMyLocation };;
