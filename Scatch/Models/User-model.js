const mongoose = require('mongoose') ;

const UserSchema = mongoose.Schema({
     fullname: String,
     email:String,
     password:String,
     contact:Number,
     cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productSchema",
     }
   ],
     orders:{
        typeof:Array,
        default:[] 
     },
     picture:String,
     contact:Number, 
})

module.exports = mongoose.model("userModel" , UserSchema)
