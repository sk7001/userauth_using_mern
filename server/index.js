const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connect_db = require('./connectDB/connect_db');

const app= express();
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use("/user", require("./UserRoutes/UserRoutes"))

app.listen(process.env.PORT,async ()=>{
    await connect_db()    
    console.log(`Server is up on port ${process.env.PORT}.`);
})