const res = require('express/lib/response');
const db = require('../db/connection');

exports.fetchAllCategories = () => {
  return db.query('SELECT * FROM categories').then((result) => {
    return result.rows;
  });
};

exports.fetchReviewById = (reviewID) => {
    if(typeof reviewID!= 'number'){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
 return db.query(`SELECT * FROM reviews WHERE review_id=$1`,[reviewID]).then((result)=>{
   if (result.rows[0]===undefined){
      return Promise.reject({status:404, msg:'Not found'})
   }
    return result.rows[0];
 })
};
