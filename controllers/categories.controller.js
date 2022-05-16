const {
  fetchAllCategories,
  fetchReviewById,
} = require('../models/categories.model');

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const reviewID = req.params.review_id;
  fetchReviewById(reviewID).then((reviewObj) => {
    res.status(200).send({ reviewObj });
  }).catch(next)
};
