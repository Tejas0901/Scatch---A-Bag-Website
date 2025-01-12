const jwt = require('jsonwebtoken')
const userModel  = require('../Models/User-model');
require('dotenv').config();

module.exports = async (req,res,next)=>{
    if(!req.cookies.token){

         req.flash({"error": 'You need to login first'})
         return res.status(401).redirect('/');
    }

    try{
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user = await userModel
        .findOne({ email : decoded.email })
        .select("-password");
        req.user = user;
        next();
    }
    catch(err)
    {
        req.flash("error", "something went wrong.");
        res.redirect("/");
    }
};