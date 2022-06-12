const { removeCommentById, changeCommentVotesById } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(({ rows }) => {
      res.status(204).send({ rows });
    })
    .catch(next);
};

exports.patchCommentVotesById=(req,res,next)=>{
  const commentId = req.params.comment_id;
  const updateVotes = req.body.inc_votes;
  changeCommentVotesById(updateVotes,commentId).then((updatedObj)=>{
  res.status(200).send({updatedObj})
  }).catch(next)
}