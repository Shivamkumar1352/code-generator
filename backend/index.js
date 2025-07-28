const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const AuthRouter = require('./Routes/AuthRouter');
const HomeRouter = require('./Routes/HomeRouter');
const ChatRouter = require('./Routes/ChatRouter');
require('dotenv').config();

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/',HomeRouter);
app.use('/chat', ChatRouter);

app.get('/ping', (req,res)=>{
    res.send('pong');
})

mongoose.connect(MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
    console.log(`server started on PORT: ${PORT}`);
})
console.log("database connected");
})

