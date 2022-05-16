const { fetchAllCategories } = require('../models/categories.model');

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
        console.log(categories)
      res.status(200).send({ categories });
     })
     .catch(next);
};
