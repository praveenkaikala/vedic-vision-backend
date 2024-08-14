const express=require("express")
const expressAsyncHandler=require("express-async-handler")
const userModel=require('../models/userModel')
const nodemailer = require('nodemailer');
const generateToken=require("../config/createToken")
const Yoga = require("../models/yogaData")
const User = require("../models/userModel")
const dotenv=require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
  service:'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
});

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
          phone:yoga.userId.phone,
          photo:yoga.userId.photo
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
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};
const sendEmail=expressAsyncHandler( async (req,res)=>{
  try {
    const {email}=req.body;
    console.log(email)
    const otp = '1234567';
    const mailOptions = {
      from: process.env.email,
      to: 'kaikalapraveen24@gmail.com',
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`, // Include the OTP in the email body
    };
   await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error', error);
        return res.status(400).json({message:"email  ssend failed"})
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({message:"email send"})
      }
    })
  } catch (error) {
    return res.send(error)
    console.log(error)
  }
})

module.exports={loginController,registerController,sendEmail}