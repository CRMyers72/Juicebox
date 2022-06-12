const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  res.send({ message: 'hello from /posts!' });

  next()
});

postsRouter.get('/', (req, res) =>{

    const posts = await.getAllPosts()
console.log(posts)
    res.send({
        posts:[]
    })
})

module.exports = postsRouter;