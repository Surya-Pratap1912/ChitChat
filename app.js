
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');


const aws = require('aws-sdk');


require('dotenv').config();

const server = require('http').createServer(app);

// attching to server
const io = require('socket.io')(server);


const accLogFiles = fs.createWriteStream(path.join(__dirname,'access.log'),{flags : 'a'});
app.use(morgan('combined',{stream : accLogFiles}));

const bodyParser = require('body-parser');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cors(/*{
    origin:'http://127.0.0.1:5501',
    methods:['GET', 'PUT', 'DELETE','POST']
}*/))
app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) => {
  res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' https://cdnjs.cloudflare.com https://api.razorpay.com https://cdn.jsdelivr.net https://checkout.razorpay.com https://img.freepik.com 'unsafe-inline';  img-src 'self' blob: https://expansetrackingapp123.s3.amazonaws.com https://cdnjs.cloudflare.com https://api.razorpay.com https://cdn.jsdelivr.net https://checkout.razorpay.com https://img.freepik.com 'unsafe-inline'"
  );
  next();
});


app.use(dashboardRoutes);
app.use(userRoutes);

const socketControllers = require('./controllers/socketControllers');
socketControllers.sockets(io);


mongoose.connect(process.env.MONGO_CONNECT)
.then(result =>{
  server.listen(process.env.PORT||3000);
  console.clear();
  console.log('yha se suru hai');
})
.catch(err =>{
  console.log('err in connection ',err); 
})