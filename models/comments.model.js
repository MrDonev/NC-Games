const db = require('../db/connection');

exports.removeCommentById = (commentId) => {
  if (isNaN(commentId)) {
    return Promise.reject({ status: 400, msg: 'Wrong input type' });
  }
  commentId = Number(commentId);
  return db
    .query(`SELECT comment_id FROM comments`)
    .then(({ rows }) => {
      if (!rows.map((id) => id.comment_id).includes(commentId)) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
    })
    .then(() => {
      return db.query(`DELETE FROM comments WHERE comment_id=$1`, [commentId]);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.changeCommentVotesById = (updatedVotes, commentId) => {
  if (updatedVotes === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `UPDATE comments 
        SET votes=votes + $1 
        WHERE comment_id=$2 
        RETURNING *`,
      [updatedVotes, commentId]
    )
    .then((result) => {
      const updatedObj = result.rows[0];
      if (!updatedObj) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
      return result.rows[0];
    });
};
