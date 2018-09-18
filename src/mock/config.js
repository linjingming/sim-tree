const fs = require("fs");
const path = require("path");
const stPath = '/api';
module.exports = function (app) {
  app.use(function(req, res, next) {
    let filePath = '';
    let arr = req.url.split(stPath + '/');
    if (arr.length) {
      filePath = path.join(__dirname, arr[1] + '.js').replace(/\//g, '_');
    }
    fs.exists(filePath, function (exists) {
      if (exists) {
        delete require.cache[filePath];
        require(filePath)(req, res, next);
      } else {
        next();
      }
    });
  });
}