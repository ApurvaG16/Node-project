const mongoose = require("mongoose")


const noteSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String
    },
    body:{
        type:String
    }
},{timeStamps:true});

module.exports= new mongoose.model("menu",noteSchema)