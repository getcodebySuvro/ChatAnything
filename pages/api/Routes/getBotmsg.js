
import express from 'express';
import cors from 'cors';
import {Configuration,OpenAIApi} from 'openai';
import * as dotenv from 'dotenv';

//middlewares
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey:process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

//Mongoose Connection



async function  handler (req, res) {
  if(req.method==="POST"){
    try{
      const prompt = req.body.prompt;
      const response = await  openai.createCompletion({
      model:"text-davinci-003",
      prompt:`${prompt}`,
      temperature:0,
      max_tokens:3000,
      top_p:1,
      frequency_penalty:0.5,
      presence_penalty:0,
  })
  res.json({message:response.data.choices[0].text})
    }catch(err){
      console.log(err);
    }
    
    
}
}



export default handler;

