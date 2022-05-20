const fs = require('fs/promises');
exports.fetchAPIJson = () => {
  return fs
    .readFile('./endpoints.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      return data;
    })
    .then((data) => {
      return data;
    });
};
