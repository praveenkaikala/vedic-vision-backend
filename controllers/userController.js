const express=require("express")
const expressAsyncHandler=require("express-async-handler")
const userModel=require('../models/userModel')

const generateToken=require("../config/createToken")
const Yoga = require("../models/yogaData")
const User = require("../models/userModel")

require("dotenv")
const loginController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ email:email }, { userName:email }]
    });
    if (user && (await user.matchPassword(password))) {
      const yoga = await Yoga.findOne({ userId: user._id }).populate('userId');

      return res.status(200).json({
        id: yoga._id,
        day: yoga.day,
        calories: yoga.calories,
        userDetails: {
          id: yoga.userId._id,
          firstName: yoga.userId.firstName,
          lastName: yoga.userId.lastName,
          userName: yoga.userId.userName,
        },
        token: generateToken(user._id),
      });
    } else {
     return res.status(400).send("user not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const registerController=expressAsyncHandler( async (req,res)=>{
    const {firstName,lastName,email,password,userName}=req.body;
    let user;
    const photo = req.file;
    if(!userName || !email || !password || !lastName || !firstName)
    { 
        res.send(400)

        // throw error("fields are not filled ")
    }
    const userexist=await userModel.findOne({email})
    if(userexist){
       res.status(401)
        res.send("email already exist")
    }
    const username=await userModel.findOne({userName})
    if(username){
       res.status(401)
        res.send("username already exist")
    }
    if(!userexist && !username)
   {
    const photoURL =photo.filename || null;
    user= await userModel.create({firstName,lastName,userName,email,password, photo: photoURL })
    const yogaEntry = await Yoga.create({
      userId: user._id
  });
   }
   else{
    res.status(400)
    res.send("not created")
   }
    if(user){
        res.status(201).json({message:"register successsfull"})
    }
    else{
        res.status(400)
        throw new Error("registration error")
    }


})


module.exports={loginController,registerController}