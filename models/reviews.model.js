const db = require('../db/connection');

exports.fetchReviewById = (reviewID) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [reviewID])
    .then((result) => {
      if (result.rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return result.rows[0];
    });
};

exports.updateReviewById = (reviewId, updateVotes) => {
  return db
    .query(
      `UPDATE reviews SET votes=votes + $1 WHERE review_id=$2 RETURNING *`,
      [updateVotes, reviewId]
    )
    .then((result) => {
      return result.rows[0];
    });
};
