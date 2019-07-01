require('dotenv').config();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); //protect routes
const User = require('./../models/user');

exports.signup =  async (req,res)=>{
    const userExits =  await User.findOne({email: req.body.email })
    if (userExits) return res.status(403).json({
        error: "Email is token."
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({message:"Signup success!! Please login"});
}
exports.signin = (req,res)=>{
    //find the user base on email
    const {email,password} = req.body;
    User.findOne({email: email}, (err,user)=>{
        //if error or no user 
         if (err || !user){
             return res.status(401).json({
                 error:"User with that email isn't exits. Please signin."
             });
         }

         //if user is found make sure the email and password match
         //create authenticate method in model and user here 
         if (!user.authenticate(password)){
             return res.status(401).json({
                error:"Email and password do not match."
             });
         }
    //if error or no user 
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    //if user authenticate
    //generate a token with user id and secret

    //persist the token as 't' in cookie with expiry date
    res.cookie("t",token,{expire: new Date() + 9999});
    //return respone with user and token to frontend  client
    const {_id,name,email} = user;
    return res.json({
        token, 
        user:{_id, email, name}
    }) 
    })
}
exports.signout = (req,res)=>{
    res.clearCookie("t"); 
    return res.status(200).json({
        message: "Signout success!"
    });
}
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty:"auth"
})
