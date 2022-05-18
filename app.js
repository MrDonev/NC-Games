const express = require('express');
const app = express();
const { getAllCategories } = require('./controllers/categories.controller');
const { CustomErrorHandler, InternalServerErr, InvalidPathErr, PSQLerrorHandler } = require('./controllers/errors.controller');
const { getReviewById, patchReviewById, getAllReviews } = require('./controllers/reviews.controller');
const { getAllUsers } = require('./controllers/users.controller');


app.use(express.json());

app.get('/api/categories', getAllCategories);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/users',getAllUsers)
app.get('/api/reviews',getAllReviews)

app.patch('/api/reviews/:review_id',patchReviewById)

app.all('/api/*', InvalidPathErr);
app.use(PSQLerrorHandler);

app.use(CustomErrorHandler);

app.use(InternalServerErr);

module.exports = app;
