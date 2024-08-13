const express=require('express')
const app=express();
const cors=require('cors')
const path = require('path');
const mongoose=require('mongoose');
const { connectDatabase } = require('./utils/connectDb');
const userRoutes=require('./routes/userRoutes')
require('dotenv')
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.status(200).send("hello backend");
  });
  app.use('/upload', express.static(path.join(__dirname, 'upload')));
  
app.use('/api/user',userRoutes)
app.listen(5000,()=>{
    console.log("app running")
})
connectDatabase()