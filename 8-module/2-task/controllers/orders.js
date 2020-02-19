const mongoose = require('mongoose');
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const ObjectId = mongoose.Types.ObjectId;

module.exports.checkout = async function checkout(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  const { product, phone, address } = ctx.request.body;
  try {
    const order = new Order({ product, phone, address, user: ctx.user._id });
    await order.save();
    await sendMail({
      to: ctx.user.email,
      template: 'order-confirmation',
      locals: { id: order._id, product: { title: '' } },
    });
    ctx.body = {
      order: order._id,
    }
  } catch(err) {
    const errors = {};

    for (const field of Object.keys(err.errors)) {
      errors[field] = err.errors[field].message;
    }
    ctx.body = {
      errors: errors,
    };

    ctx.status = 400;
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({ user: ctx.user._id });
  ctx.body = {
    orders: orders,
  };
};
