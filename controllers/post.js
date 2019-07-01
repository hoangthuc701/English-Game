const Post = require('./../models/post');
const Auth = require('./../controllers/auth')
const fs = require('fs');
const _ = require('lodash');


exports.getPosts =  (req,res)=>{
    const posts = Post.find()
    .populate("postedBy","_id name")
    .select("_id body created")
    .sort({'created':'desc'})
    .then((posts)=>{
        res.status(200).json({
            posts
        }) 
    })
    .catch(err=> console.log(err));
}

exports.createPost  =  (req,res,next)=>{
    const post = new Post(req.body);
    post.postedBy = req.profile;

    post.save()
    .then(result=>{
        res.status(200).json({
            post: result
        });
        req.io.sockets.emit('refresh','hello');
        next();
    })
    .catch(err=>console.log(err));
}
exports.postById = (req,res,next,id)=>{
    Post.findById(id)
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if (err||!post)
            {
                return res.status(400).json({
                    error:err
                });
            }
        req.post=post;
        next();
        });
}