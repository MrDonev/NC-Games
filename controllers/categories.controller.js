const { fetchAllCategories, addNewCategory } = require('../models/categories.model');

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postNewCategory=(req,res,next)=>{

  const newCategory=req.body;
  addNewCategory(newCategory).then((addedCategory)=>{
    res.status(201).send({addedCategory})
  }).catch(next)
}