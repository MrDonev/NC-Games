const { fetchAllUsers, fetchUserByUsername } = require('../models/users.model');

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((usersArray) => {
    res.status(200).send({ usersArray });
  }).catch(next)
};

exports.getUserByUsername=(req,res,next)=>{
  fetchUserByUsername(req.params.username).then((userObj)=>{
  res.status(200).send({userObj})
  }).catch(next)
}