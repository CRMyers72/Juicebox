const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  res.send({ message: 'hello from /tags!' });

  next()
});

tagsRouter.get('/', (req, res) =>{

    const tags = await.getAllTags()
console.log(tags)
    res.send({
        tags:[]
    })
})

module.exports = tagsRouter;