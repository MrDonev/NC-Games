const {
  updateReviewById,
  fetchAllReviews,
  fetchReviewCommentsById,
  addCommentByReviewId,
  addNewReview
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
  const { sort_by, category, order_by } = req.query;
  fetchAllReviews(category, sort_by, order_by)
    .then((reviewsArr) => {
      res.status(200).send({ reviewsArr });
    })
    .catch(next);
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

  addCommentByReviewId(reviewId, newComment)
    .then((addedComment) => {
      res.status(201).send({ addedComment });
    })
    .catch(next);
};

exports.postNewReview=(req,res,next)=>{
const newReview=req.body;
addNewReview(newReview).then((addedReview)=>{
  res.status(201).send({addedReview})
}).catch(next)
}