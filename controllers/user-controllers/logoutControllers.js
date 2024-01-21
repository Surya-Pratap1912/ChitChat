const Users = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.logout = async (req, res, next) => {
  // // console.log('in lgout2');
  const { _id } = req.user;
const user = await Users.findOne(_id);
  
      user.loggedIn = false;
      await user.save();
      // const time = new Date().toString();
      // user.createMessege({
      //   text: `${user.userName} left`,
      //   time: time,
      //   sentBy: user.userName,
      //   receivedBy: 'none',
      //   type: "log",

      //   // userId: req.user.id
      // });
      res.redirect("/login");
    
};

