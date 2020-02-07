const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  req.connection.on('close', function(e) {
    if (e) {
      fs.unlink(filepath, () => {});
    }
  });

  switch (req.method) {
    case 'POST':
      if (pathname &&  (pathname.split('/').length > 1)) {
        res.statusCode = 400;
        res.end('Nested dir');
        return;
      } 

      if (pathname && fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exists');
        return;
      } 
      
      const writeStream = fs.createWriteStream(filepath);
        const limitSizeStream = new LimitSizeStream({ limit: 10, readableObjectMode: true });
        req
        .pipe(limitSizeStream)
        .on('error', function(e) {
          res.writeHead(413);
          res.end();
          fs.unlink(filepath, () => {});
        })
        .pipe(writeStream);
        req.on('end', function() {
          res.writeHead(201);
          res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
