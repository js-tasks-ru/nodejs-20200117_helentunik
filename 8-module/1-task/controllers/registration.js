const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const { email, displayName, password } = ctx.request.body;
  try {
    const user = new User({
      verificationToken: token,
      email: email,
      displayName: displayName,
    });
    await user.setPassword(password);
    await user.save();
    await sendMail({
      to: email,
      template: 'confirmation',
      locals: { token: token },
    });
  
    ctx.body = {
      status: 'ok',
    };
  } catch (err) {
    ctx.body = {
      errors: {
        email: 'Такой email уже существует'
      }
    };
    ctx.status = 400;
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken, email } = ctx.request.body;
  if (verificationToken) {
    const user = await User.findOne({ verificationToken });
    if (user) {
      await user.update({ '$unset': { verificationToken: undefined }});
      ctx.body = {
        token: verificationToken,
      };
    } else {
      ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
    }
  }
};
