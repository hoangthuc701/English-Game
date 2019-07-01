const express= require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    postById
} = require('./../controllers/post')
const {createPostValidator} = require('./../validator/index')
const {requireSignin} = require('./../controllers/auth')
const {userById} = require('./../controllers/user')


router.get('/',getPosts);
router.post('/post/new/:userId',requireSignin,createPostValidator,createPost);
//any route containing : userId, our app will first exwcute userById()
router.param('userId', userById);
router.param('postId', postById);
module.exports = router;