const { all } = require('../app');
const db = require('../db/connection');

exports.fetchReviewById = (reviewID) => {
  return db
    .query(
      `SELECT reviews.*, COUNT (
      comments.body
    ) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id=comments.review_id
    WHERE reviews.review_id=$1 
    GROUP BY reviews.review_id`,
      [reviewID]
    )
    .then((result) => {
      if (result.rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      const reviewObj = { ...result.rows[0] };
      reviewObj.comment_count = Number(reviewObj.comment_count);
      return reviewObj;
    });
};

exports.updateReviewById = (reviewId, updateVotes) => {
  if (updateVotes === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `UPDATE reviews 
      SET votes=votes + $1 
      WHERE review_id=$2 
      RETURNING *`,
      [updateVotes, reviewId]
    )
    .then((result) => {
      const updatedObj = result.rows[0];
      if (!updatedObj) {
        return Promise.reject({ status: 404, msg: 'Review not found' });
      }
      return result.rows[0];
    });
};

exports.fetchAllReviews = () => {
  return db
    .query(
      `SELECT reviews.*, 
      COUNT (
    comments.body
  ) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id=comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
return rows.map((review) => {
          delete review.review_body;
          delete review.designer;
          review.comment_count = Number(review.comment_count);
          return review;
        })
    });
// const allReviews = db.query(`SELECT * FROM reviews`)
// const allComments = db.query(`SELECT * FROM comments`)
// return Promise.all([allReviews, allComments]).then(([reviewsData, commentsData])=>{
//     const everyReview=reviewsData.rows;
//     const everyComment=commentsData.rows;
//     everyReview.forEach((review)=>{
//       review.comment_count=0;
//       everyComment.forEach((comment)=>{
//         if(comment.review_id===review.review_id){
//           review.comment_count++;
//         }
//       })
//     })
//   return everyReview;
// })
};
