const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const postSchema  = new mongoose.Schema({
    body:{
        type: String,
        required:true
    },
    postedBy:{
        type: ObjectId,
        ref: "User"
    }, 
    created: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Post",postSchema);

