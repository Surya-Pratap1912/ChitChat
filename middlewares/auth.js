const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const path = require('path');

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const { userId } = jwt.verify(
      token,
      "2ih8y93jdb8y!EDWD2#jihajx73$5%(83990"
    );

    const  user = await Users.findOne({'email':userId});
        if (user && user.loggedIn) 
        {
          req.user = user;
          next();
        }
        else {
          res.status(401).json({redirectTo: '/login'});
        
          return ;
        }
     
  } catch (err) {
    res.status(401).json({ success: false });
  }
};

module.exports = {
  Authenticate,
};
