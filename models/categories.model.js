
const db = require('../db/connection');

exports.fetchAllCategories = () => {
  return db.query('SELECT * FROM categories').then((result) => {
    return result.rows;
  });
};

exports.addNewCategory=(newCategory)=>{
  if (!Object.keys(newCategory).includes('slug','description')) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `
  INSERT INTO categories (slug, description)
  VALUES ($1, $2)
  RETURNING *;`,
      [newCategory.slug, newCategory.description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}