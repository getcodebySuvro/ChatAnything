import mongoose from "mongoose";


const NoteSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        
    },
    question:{
        type:String,
        required:true,
        
    },
    ans:{
        type:String,
        required:true,
        min:5,
    }
},{timestamps:true})

module.exports = mongoose.models.Note || mongoose.model("Note",NoteSchema);