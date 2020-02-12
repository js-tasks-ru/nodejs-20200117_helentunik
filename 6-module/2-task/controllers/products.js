const mongoose = require('mongoose');
const Product = require('../models/Product');
const { productMapper } = require('../utils');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const products = ctx.query.subcategory ?
   await Product.find({ subcategory: ctx.query.subcategory }) : await Product.find();
  if (products.length > 0) {
    ctx.body = { products: products.map((item) => productMapper(item))};
  } else {
    ctx.body = { products: [] };
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = { products: products.map((item) => productMapper(item))};
};

module.exports.productById = async function productById(ctx, next) {
  if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    const product = await Product.findOne({ _id: ctx.params.id });
    if (product) {
      ctx.body = { product: { ...product, id: product._id} };
    } else {
      ctx.status = 404;
    }
  } else {
    ctx.status = 400;
  }
};
