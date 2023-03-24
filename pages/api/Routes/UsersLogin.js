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
      const user = await User.findOne({username:req.body.username})
       
     if(!user) {res.status(400).json("No user found")}
     //validate password
     if(user){
         const validPassword = await bcrypt.compare(req.body.password,user.password)
     if(!validPassword) {res.status(400).json("Wrong  password")}
     
     //sending response
     if(user && validPassword)
     {res.status(200).json({_id:user._id,username:user.username,email:user.email})}
     else{
      res.status(400).json("Try some moments later")
     }

}
    }catch(err){
      console.log(err);
    }
     //find user
     

 
  }

  }
  

  
  export default handler;