const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.bytesInBuffer = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytesInBuffer += chunk.length;
    if (this.bytesInBuffer > this.limit) {
      const error = new LimitExceededError();
      return callback(error);
    }
    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
