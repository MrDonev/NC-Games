const express = require('express');
const { getAllCategories, getReviewById } = require('./controllers/categories.controller');
const app=express();

app.use(express.json());

app.get('/api/categories',getAllCategories)
app.get('/api/reviews/:review_id',getReviewById)


app.all('/api/*',(req,res)=>{
    res.status(404).send({msg: 'Not found'})
})
app.use((err,req,res,next)=>{
   res.status(err.status).send({msg: err.msg })
})

app.use((err, req, res, next)=>{
    res.status(500).send({msg: 'Internal Server Error!'})
})

module.exports=app;