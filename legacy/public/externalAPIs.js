if (window && window.torus === undefined) { window.torus = {} }
if (window && window.torus && window.torus.externalAPIs === undefined) { window.torus.externalAPIs = {} }

window.torus.externalAPIs.ethGas = function(cb) {
  var request = new XMLHttpRequest();
  var requestString = 'https://ethgasstation.info/json/ethgasAPI.json';
  request.open('GET', requestString, true);
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      var gasInfo = JSON.parse(this.response);
      var gweiSafeLow = gasInfo.safeLow / 10;
      var gweiFastest = gasInfo.fastest / 10;
      cb(null, {gasInfo, gweiSafeLow, gweiFastest})
    } else {
      cb(new Error(`Request failed, status:${request.status}`), null)
    }
  }
  // Send request
  request.send();
}