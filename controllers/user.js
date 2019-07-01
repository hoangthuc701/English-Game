const _ = require('lodash');
const User = require('./../models/user');


exports.userById = (req,res,next,id)=>{
    User.findById(id).exec((err, user)=>{
        if (err|| !user){
            res.status(400).json({
                error:"User not found"
            })
        } 
        req.profile = user; //add profile object in req with user infor
        next(); 
    })
}
exports.hasAuthorization = (req,res, next)=>{
    const authorized  = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorized){
        return res.status(403).json({
            error: 'User is not authorized to perform this action. '
        });
    }
    next();
}
exports.allUsers = (req,res)=>{
    User.find((err,users)=>{
        if (err){
            return res.status(400).json({
                err:err
            })
        }
        res.json({users});
    }).select("name email updated created");
}

exports.getUser = (req,res)=>{
    req.profile.salt = undefined;
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
}