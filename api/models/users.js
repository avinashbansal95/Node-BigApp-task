const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        id:mongoose.Schema.Types.ObjectId,
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        dob:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true
        }
    }
)


module.exports = mongoose.model('User',userSchema);