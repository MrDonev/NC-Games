const { fetchAPIJson } = require('../models/api.model');

exports.apiJSON = (req, res, next) => {
  fetchAPIJson().then((data) => {
    res.status(200).send({ data: JSON.parse(data) });
  }).catch(next)
};
