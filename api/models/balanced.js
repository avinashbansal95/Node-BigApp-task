const mongoose = require('mongoose');
const balancedSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        message:{
            type:String,
            default:'failed'
        }
    }
)

module.exports = mongoose.model('Balanced',balancedSchema);