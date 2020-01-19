function sum(a, b) {
  /* ваш код */
  if (Number.isFinite(a) && Number.isFinite(b)) {
    return a + b;
  }
  throw new TypeError('Argument is not number');
}

module.exports = sum;
