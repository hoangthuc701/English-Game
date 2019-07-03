const checkWord = require('check-word');
const words = checkWord('en'); 
const Post = require('./../models/post')

const checkNextWord = async(word)=>{
    var words_posted = ['english'];
    await Post.find({},(err,posts)=>{
        posts.forEach(item=>{
            words_posted.push(item.body);
        });
        
    })
    var item =words_posted[words_posted.length-1]; 
    var x1= item[item.length-1].toLowerCase();
    var x2= word[0].toLowerCase();
    var result = (x1===x2);
    //console.log(result);
    return result;
}

exports.createPostValidator = async(req,res,next)=>{
    
   
     //check body
     req.check('body',"Write something.").notEmpty();
     //check for error
     const errors = req.validationErrors();
     if (errors)
     {
         const firstError = errors.map((err)=> err.msg)[0];
         return res.status(400).json({
             error: firstError
         })
         
     }
     var ok =true;
     await checkNextWord(req.body.body)
    .then(result=>{
        if (!result)
        {
            ok=false;
        }
    })
    if (!ok)
    {
        return res.status(400).json({
            error:"You just need to get the last letter of the word that was posted as the first letter for your word."
        });
    }
     //check word is avilable
     //console.log(words.check(req.body.body));
     if (!words.check(req.body.body)){
        
         return res.status(400).json({
             error:"This word is not incorrect."
         })
    }

    //check word begin with word posted
    
     //process to next middleware
     next();
}
exports.userSignUpValidator = (req,res,next)=>{
    req.check('name',"Name is required.").notEmpty();
    req.check('email',"Email must be between 3 to 32 characters.")
    .matches(/.+\@.+\..+/)
    .withMessage("Invalid Email Format.")
    .isLength({
        min:4,
        max:32
    })
    req.check('password',"Password is required.").notEmpty()
    req.check('password')
    .isLength({
        min:6
    })
    .withMessage("Password must containt at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain number")
    //check for error
    const errors = req.validationErrors();
    if (errors)
    {
        const firstError = errors.map((err)=> err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
        
    }
    //process to next middleware
    next();
}