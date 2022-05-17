exports.PSQLerrorHandler = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.CustomErrorHandler = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

exports.InternalServerErr = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error!' });
};

exports.InvalidPathErr = (req, res) => {
  res.status(404).send({ msg: 'Not found' });
};
