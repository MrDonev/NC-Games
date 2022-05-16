const {fetchReviewById}=require('../models/reviews.model')

exports.getReviewById = (req, res, next) => {
    const reviewID = req.params.review_id;
    fetchReviewById(reviewID).then((reviewObj) => {
      res.status(200).send({ reviewObj });
    }).catch(next)
  };
  