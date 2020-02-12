const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = { categories: categories.map(({ _id, title, subcategories }) => ({
    id: _id,
    title: title,
    subcategories: subcategories.map(({ _id, title }) => ({
      id: _id,
      title: title,
    }))
  }))};
};
