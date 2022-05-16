const db = require('../db/connection');

exports.fetchReviewById = (reviewID) => {
  console.log(`review model`);
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [reviewID])
    .then((result) => {
      if (result.rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return result.rows[0];
    });
};
