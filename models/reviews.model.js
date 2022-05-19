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
      `SELECT reviews.owner,
      reviews.title,
      reviews.review_id,
      reviews.category,
      reviews.review_img_url,
      reviews.created_at,
      reviews.votes,
      COUNT (comments.body) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id=comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows.map((review) => {
        review.comment_count = Number(review.comment_count);
        return review;
      });
    });
};

exports.fetchReviewCommentsById = (id) => {
  const reviewId = db.query(
    `SELECT review_id FROM reviews WHERE review_id=$1`,
    [id]
  );
  const commentsById = db.query(`SELECT * FROM comments WHERE review_id=$1`, [
    id,
  ]);
  return Promise.all([reviewId, commentsById]).then(
    ([reviewData, commentsData]) => {
      if (reviewData.rows.length > 0 && commentsData.rows.length > 0) {
        return commentsData.rows;
      } else if (reviewData.rows.length > 0 && commentsData.rows.length === 0) {
        return [];
      } else {
        return Promise.reject({ status: 404, msg: 'Comments not found' });
      }
    }
  );
};

exports.addCommentByReviewId = (reviewId, newComment) => {
  if (Object.keys(newComment).length < 2){
    return Promise.reject({status:400, msg: 'Bad Request'})
  }
  return db
    .query(
      `
  INSERT INTO comments (body, review_id, author, votes)
  VALUES ($1, $2, $3,$4)
  RETURNING *;`,
      [newComment.body, reviewId, newComment.username, 0]
    )
    .then(({ rows }) => {
     return rows[0];
    });
};
