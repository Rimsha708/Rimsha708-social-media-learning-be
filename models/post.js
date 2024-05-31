const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types

/*
user={object_id: 121232}
post={postedby:121232}

*/
//console.log("data in post")
const postSchema=new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    comments:[{
        text:String,
        name:String,
        postedby:{type:ObjectId, ref:"User"}
      
    }],
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    postedby:{
         type: ObjectId,
         ref:"User"
    }
    

})
//console.log("post :",postSchema);
module.exports=mongoose.model("Post",postSchema);