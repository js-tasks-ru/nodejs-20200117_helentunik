const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  } else {
    await User.findOne({ email: email }, async (err, user) => {
      if (err) {
        return done(err);
      }
  
      if (!user) {
        const newUser = new User({ email, displayName });
        newUser.save((userErr, createdUser) => {
          if (userErr) {
            return done(userErr);
          }
          return done(null, createdUser);
        });
      }
  
      return done(null, user);
    });
  }
};
