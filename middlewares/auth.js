const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const path = require('path');

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    //Extracting token from authorization header
    const token = authHeader && authHeader.split(" ")[1];
    // console.log('in authentication ');
    //   const token = req.header["Authorization"];
    //   const token = req.header("Authorization");
    // console.log("token >>>>  ", token);
    const { userId } = jwt.verify(
      token,
      "2ih8y93jdb8y!EDWD2#jihajx73$5%(83990"
    );

    //   // console.log(userId);
    const  user = await Users.findOne({'email':userId});
           // console.log("user   >>  ", user.loggedIn);
        if (user && user.loggedIn) 
        {
          req.user = user;
          next();
        }
        else {
          // console.log("user is not logged in");
          // res.sendFile(path.join(__dirname,'..','views','login.html'));
          // res.status(302).location('/login');
          res.status(401).json({redirectTo: '/login'});
        
          return ;
        }
        //   // console.log("req.user >   ", req.user);
     
  } catch (err) {
    // console.log("err in auth", err);
    res.status(401).json({ success: false });
  }
};

module.exports = {
  Authenticate,
};
