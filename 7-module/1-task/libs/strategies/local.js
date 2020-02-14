const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
    },
    async function(email, password, done) {
      await User.findOne({ email: email }, async (err, user) => {

        if (err) {
          return done(err)
        }

        if(!user) {
          return done(null, false, 'Нет такого пользователя');
        }
      
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
          return done(null, false, 'Неверный пароль');
        }

        return done(null, user);
      });
    }
);
