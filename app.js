var express = require('express');
const app= express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
var cors = require('cors')
var server = require("http").Server(app);
var io = require("socket.io")(server);

//connect to db 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true})
.then(()=>console.log("DB connected."));
mongoose.connection.on('error',err=>{
    console.log(err.message);
})
/*
io.on('connection',socket=>{
  console.log("co nguoi.")
  io.sockets.emit('refresh');
})
*/

//import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');




//middleware
app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(cors()) 
app.use('/',authRoute);
app.use('/',userRoute);
app.use('/',postRoute);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({
          error:"Unauthenticate"
      });
    }
  });

//set up server listen
const port= process.env.PORT||3000;
server.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
});

