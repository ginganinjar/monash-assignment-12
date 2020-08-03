const fs = require('fs');

const showHeader = (header) => new Promise((resolve, reject) => {
  fs.readFile(header, function (error, data) {
    if (error) {
      reject(error);
    } else {
      resolve(data.toString());
    }
  });
});

exports.showHeader = showHeader;
