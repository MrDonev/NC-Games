const express = require('express');
const { apiJSON } = require('./controllers/api.controller');
const app = express();
const { getAllCategories } = require('./controllers/categories.controller');
const { deleteCommentById, patchCommentVotesById } = require('./controllers/comments.controller');
const { CustomErrorHandler, InternalServerErr, InvalidPathErr, PSQLerrorHandler } = require('./controllers/errors.controller');
const { postNewReview, getReviewById, patchReviewById, getAllReviews, getReviewCommentsById, postCommentByReviewId } = require('./controllers/reviews.controller');
const { getAllUsers, getUserByUsername } = require('./controllers/users.controller');


app.use(express.json());

app.get('/api/categories', getAllCategories);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/users',getAllUsers)
app.get('/api/reviews',getAllReviews)
app.get('/api/reviews/:review_id/comments',getReviewCommentsById)
app.get('/api/users/:username',getUserByUsername)

app.post('/api/reviews/:review_id/comments',postCommentByReviewId)
app.post('/api/reviews',postNewReview)

app.patch('/api/reviews/:review_id',patchReviewById)
app.patch('/api/comments/:comment_id',patchCommentVotesById)

app.delete('/api/comments/:comment_id',deleteCommentById)

app.get('/api',apiJSON)

app.all('/api/*', InvalidPathErr);
app.use(PSQLerrorHandler);

app.use(CustomErrorHandler);

app.use(InternalServerErr);

module.exports = app;
