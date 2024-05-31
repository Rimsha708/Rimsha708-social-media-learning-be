//creating schema- blue print of table
const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types


const userSchema=new mongoose.Schema({
    name:{
        //column names
        type:String,
        required:true,

    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/rimshacloud/image/upload/v1716702251/1_nxc5dl.png"
    },

    followers:[{ type:ObjectId, ref:"User" }],
    following:[{type:ObjectId, ref:"User"}],

  

})

module.exports=mongoose.model("User",userSchema)