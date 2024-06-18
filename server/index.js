const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app= express();
app.use(cors())
app.use(morgan("dev"))
app.get("/test",(req,res)=>{
    res.json("Hello World!")
})
app.listen(process.env.PORT,()=>{
    console.log(`Server is up on port ${process.env.PORT}.`);
})