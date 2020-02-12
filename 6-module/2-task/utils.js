const productMapper = ({ _id, title, images, category, subcategory, price, description }) => {
  return {
    id: _id,
    title,
    images,
    category,
    subcategory,
    price,
    description,
  }
}

module.exports.productMapper = productMapper;