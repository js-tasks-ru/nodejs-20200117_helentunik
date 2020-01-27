const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.currentString = '';
  }

  _transform(chunk, encoding, callback) {
    const stringChunk = chunk.toString();
    let lines = [];

    if (this.currentString) {
      lines = `${this.currentString}${stringChunk}`.split(os.EOL);
    } else {
      lines = stringChunk.split(os.EOL);
    }
    this.currentString = lines.pop();
    for (const line of lines) { this.push(line); }
    callback();
  }

  _flush(callback) {
    if (this.currentString) {
      this.push(this.currentString);
    } else {
      this.push('');
    }
    callback();
  }
}

module.exports = LineSplitStream;
