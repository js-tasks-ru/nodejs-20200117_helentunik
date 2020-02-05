const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const fileTypes = {
  html: 'text/html',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  js: 'text/javascript',
  css: 'text/css'
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      try {
        if (pathname &&  (pathname.split('/').length > 1)) {
          res.statusCode = 400;
          res.end('Nested dir');
        } else if (pathname && fs.existsSync(filepath)) {
          const mimeType = fileTypes[path.extname(filepath).split(".")[1]];
          res.writeHead(200, mimeType);
    
          const fileStream = fs.createReadStream(filepath);
          fileStream.pipe(res);
        } else {
          res.statusCode = 404;
          res.end(`File ${pathname} not found!`);
        }
      } catch (e) {
        res.statusCode = 500;
        res.end(e);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
