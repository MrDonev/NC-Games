const express = require('express');
const { getAllCategories } = require('./controllers/categories.controller');
const { getReviewById, patchReviewById } = require('./controllers/reviews.controller');
const app = express();

app.use(express.json());

app.get('/api/categories', getAllCategories);
app.get('/api/reviews/:review_id', getReviewById);

app.patch('/api/reviews/:review_id',patchReviewById)

app.all('/api/*', (req, res) => {
  res.status(404).send({ msg: 'Not found' });
});
app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  }else {
      next(err)
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error!' });
});

module.exports = app;
