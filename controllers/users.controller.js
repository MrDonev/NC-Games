const { fetchAllUsers } = require('../models/users.model');

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((usersArray) => {
    res.status(200).send({ usersArray });
  });
};
