const { removeCommentById } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(({ rows }) => {
      res.status(204).send({ rows });
    })
    .catch(next);
};
