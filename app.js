const express = require('express');
const { getAllCategories } = require('./controllers/categories.controller');
const { CustomErrorHandler, InternalServerErr, InvalidPathErr, PSQLerrorHandler } = require('./controllers/errors.controllers');
const { getReviewById, patchReviewById } = require('./controllers/reviews.controller');
const app = express();

app.use(express.json());

app.get('/api/categories', getAllCategories);
app.get('/api/reviews/:review_id', getReviewById);

app.patch('/api/reviews/:review_id',patchReviewById)

app.all('/api/*', InvalidPathErr);
app.use(PSQLerrorHandler);

app.use(CustomErrorHandler);

app.use(InternalServerErr);

module.exports = app;
