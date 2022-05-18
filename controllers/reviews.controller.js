const {
  updateReviewById,
  fetchAllReviews,
  fetchReviewCommentsById,
  addCommentByReviewId,
} = require('../models/reviews.model');
const { fetchReviewById } = require('../models/reviews.model');

exports.getReviewById = (req, res, next) => {
  const reviewID = req.params.review_id;
  fetchReviewById(reviewID)
    .then((reviewObj) => {
      res.status(200).send({ reviewObj });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  const updateVotes = req.body.inc_votes;
  updateReviewById(reviewId, updateVotes)
    .then((updatedReview) => {
      res.status(200).send({ updatedReview });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews().then((reviewsArr) => {
    res.status(200).send({ reviewsArr });
  });
};

exports.getReviewCommentsById = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchReviewCommentsById(reviewId)
    .then((commentsArray) => {
      res.status(200).send({ commentsArray });
    })
    .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
  const newComment = req.body;
  const reviewId = req.params.review_id;

  addCommentByReviewId(reviewId, newComment);
};
