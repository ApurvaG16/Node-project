const mongoose =require("mongoose")


const favouriteSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    noteId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Notes"
    }
},{timeStamps:true})

module.exports=new mongoose.model("favourite",favouriteSchema)