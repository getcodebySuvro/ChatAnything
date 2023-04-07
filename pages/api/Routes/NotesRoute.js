import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import dbConnect from "../dbConnect";
import Note from "../Models/Note"

//middlewares
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

dbConnect();

async function  handler (req, res) {
    if(req.method==="GET"){
      try{
        if(Note){
          const notes = await Note.find({});
        res.status(200).json(notes);
        }else{
          res.status(400).json({success:false,message:"Not Found"});
        }
      }catch(err){
        console.log(err);
      }
    
      
  }
  if(req.method==="POST"){
    if(req.body.user){
      try{
        if(Note){
          const user = req.body;
          const notes = await Note.find({username:`${user}`}).exec();
        res.status(200).json(notes);
        }else{
          res.status(400).json({success:false,message:"Not Found"});
        }
      }catch(err){
        console.log(err);
      }

    }
    if(req.body.username){
      try{
        const newNote = new  Note(req.body);
        const SavedNote = await newNote.save();
        res.status(200).json(SavedNote);
      }catch(err){
        console.log(err);
      }
    }
    
 
  }

  if(req.method==="PUT"){
    const editedNote = req.body;
    try{
      await  Note.findByIdAndUpdate(editedNote.newData.id,{
        username:editedNote.newData.username,
        question:editedNote.newData.question,
        ans:editedNote.newData.ans
      });
    res.status(200).send(editedNote)
    }catch(err){
      console.log(err);
    }
      
  }

  if(req.method==="DELETE"){
       const id = req.body.id;
       try{
        await Note.findByIdAndDelete(id).exec();
        res.status(200).json("Deleted");
       }catch(err){
        console.log(err);
       }

  }



  }
  
  
  
  export default handler;
