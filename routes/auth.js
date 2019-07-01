const express = require('express');
const Auth = require('../controllers/auth')
const Validator = require('./../validator/index')
const {userById} = require('../controllers/user')
const router = express.Router();

router.post('/signup',Validator.userSignUpValidator,Auth.signup);
router.post('/signin',Auth.signin);
router.get('/signout',Auth.signout);
//any route containing : userId, our app will first exwcute userById()
router.param('userId', userById);

module.exports = router;

