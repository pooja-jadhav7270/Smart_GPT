import express from "express";
import Thread from "../models/Thread.js";
import getopenAIAPIResponse from "../utils/openAI.js";

const router = express.Router();

//test
router.post("/test",async(req,res) => {
    try{
        const thread = new Thread({
            threadId:"xyz",
            title:"Teasing new Thread 2"
        });

        const response = await thread.save();
        res.send(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to save in DB"});
    }
});


//get all threads

router.get("/thread",async(req,res) => {
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        //desending order of updatedAt.....most resend data on top
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to featch thread"});
    }
});

router.get("/thread/:threadId",async(req,res) => {
    const { threadId } = req.params;
    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }

        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to featch chat"});
    }
});

router.delete("/thread/:threadId",async(req,res) =>{
    const {threadId} = req.params; 
   try{
       const deletedThred = await Thread.findOneAndDelete({threadId});

       if(!deletedThred){
        res.status(404).json({error:"Thread not found"});
       }

       res.status(200).json({snccess:"Thread deleted successfully"});

   }catch(err){
    console.log(err);
    res.status(500).json({error:"Failed to delete thread"});
   }
    
});

router.post("/chat",async(req,res) =>{
    const{threadId, message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error:"missing require feilds"});
    }
    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
            //create a new thread in DB
            thread = new Thread({
                threadId,
                title:message,
                messages:[{role: "user", content: message}]
            });
        }else{
            thread.messages.push({role: "user" , content: message});
        }

        const assistantReply = await getopenAIAPIResponse(message);

        thread.messages.push({role:"assistant", content: assistantReply});
        thread.updatedAt = new Date();

         await thread.save();
         res.json({reply:assistantReply});


    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong"});
    }
});

export default router;