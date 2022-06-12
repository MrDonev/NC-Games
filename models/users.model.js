const db = require('../db/connection');

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows }) => {
      if (Object.keys(rows[0]).length<1){
        return Promise.reject({status:404, msg:'User not found'})
      }
      console.log(rows[0])
      return rows[0];
    });
};
