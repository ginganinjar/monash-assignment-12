var fs = require('fs');

const showHeader = (app) => {
  fs.readFile( app, function (err, data) {
    if (err) {
      throw err; 
    }
    console.log(data.toString() + "\n");
  });
}

exports.showHeader = showHeader;


  
