const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname &&  (pathname.split('/').length > 1)) {
        res.statusCode = 400;
        res.end('Nested dir');
        return;
      } 

      fs.exists(filepath, function(exists) {
        if (exists) {
          fs.unlink(filepath, () => {});
          res.statusCode = 200;
        } else {
          res.statusCode = 404;
        }
        res.end();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
