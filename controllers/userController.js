const express=require("express")
const expressAsyncHandler=require("express-async-handler")
const userModel=require('../models/userModel')
const generateToken=require("../config/createToken")
require("dotenv")
const loginController=expressAsyncHandler(async (req,res)=>{
  const {name,password}=req.body;
  const user=await userModel.findOne({name})
  if(user && (await user.matchPassword(password)))
  {
    res.status(200)
    res.json({
        _id:user.id,
        name:user.name,
        email:user.email,
        password:user.password,
        token:generateToken(user._id),
    })
  }
  else{
    res.status(400)
    throw new Error("username or password incorrect")
  }
})
const registerController=expressAsyncHandler( async (req,res)=>{
    const {name,email,password}=req.body;
    let user;
    if(!name || !email || !password)
    { 
        res.send(400)
        // throw error("fields are not filled ")
    }
    const userexist=await userModel.findOne({email})
    if(userexist){
       res.status(401)
        res.send("email already exist")
    }
    const username=await userModel.findOne({name})
    if(username){
       res.status(401)
        res.send("username already exist")
    }
    if(!userexist && !username)
   {
    user= await userModel.create({name,email,password})
   }
   else{
    res.status(400)
    res.send("not created")
   }
    if(user){
        res.status(201).json({
            id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error("registration error")
    }


})

const fetchAllUserController=expressAsyncHandler(async (req,res)=>{
  const keyword=req.query.search?{
    $or:[
        {name:{$regex:req.query.search,$options:"i"}},
        {email:{$regex:req.query.search,$options:"i"}},
    ],
  }
:{};
try{
    const user=await userModel.find(keyword).find({
    _id:{$ne:req.user.id},
});
res.send(user)
}
catch(err)
{
    res.status(401);
    throw new Error("user not found ")
}
})
module.exports={loginController,registerController,fetchAllUserController}