import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import dbConnect from "../dbConnect";
import User from "../Models/User";
const bcrypt = require("bcrypt");


//middlewares
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

dbConnect();

async function  handler (req, res) {
   
  if(req.method==="POST"){
    try{
      const user = await User.findOne({username:req.body.username});
    const email = await User.findOne({email:req.body.email});
    if(!user && !email){
        
            //hashing the password to store in DB
            const salt = await bcrypt.genSalt(10);
            const securedpassword = await bcrypt.hash(req.body.password,salt);
    
            //create new user
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                password:securedpassword
            })
            //save new user
            const user = await newUser.save();
            res.status(200).json({_id:user._id,username:user.username,email:user.email});
  }else{
    res.status(400).json("User already exist");
  }
    }catch(err){
      console.log(err);
    }
    

}

  if(req.method==="DELETE"){
       const id = req.body.id;
       await User.findByIdAndDelete(id).exec();
       res.status(200).json("Deleted");
  }



  }
  

  
  export default handler;