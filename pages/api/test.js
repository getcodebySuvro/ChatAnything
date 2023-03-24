import dbConnect from "./dbConnect";

dbConnect();

export default async(req,res)=>{
    res.json({test:"test"});
}