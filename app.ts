import express from "express";

const server = express();


server.get('/',(req,res)=>{
    console.log("at /");
    res.status(200).send("hello world typescript");
    
})

server.listen(3000,()=>{
    console.log("server is listening to port 3000");
})

