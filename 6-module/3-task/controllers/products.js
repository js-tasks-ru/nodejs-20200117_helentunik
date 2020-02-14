const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const products = await Product.find(
    { $text: { $search: ctx.query.query }},
    { score: { $meta: 'textScore' }},
  ).sort({ score: { $meta: 'textScore' }});
  if (products.length > 0) {
    ctx.body = { products };
  } else {
    ctx.body = { products: [] };
  }
};
