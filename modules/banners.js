var fs = require('fs');
module.exports = function (app) {
// provide nice greeting
fs.readFile( "./assets/intro.txt", function (err, data) {
    if (err) {
      throw err; 
    }
    console.log(data.toString());
  });
}

