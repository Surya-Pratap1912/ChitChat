const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Users = require("../../models/users");

exports.signUp = async (req, res, nex) => {
  try {
    // console.log("in signUp.js");
    // console.log(req.body);
    let { name: userName, phone, mail: id, password } = req.body;

    toString(phone);
    const user = await Users.findOne({ 'email': id });

    if (user) {
      // console.log("user already exists ", user);
      res.json({ message: "user already exists, please try logging in" });
    } else {
      // console.log("not ext");

      // Encrypting the passwords
      const hash = await bcrypt.hash(password, 10 /* salt */);

      const newUser = new Users({
        email: id,
        phone,
        userName,
        password: hash,
        loggedIn: false,
        groups:[]
      });

      await newUser.save()
        .then((response) => {
          res
            .status(201)
            .json({ message: "signed up successfully, go to login" });
        })
        .catch((err) => {
          // console.log("error in create user", err);
          res.status(500).json({ message: "internal server error" });
        });
    }
  } catch (err) {
    // console.log("Error in signUp: ", err);
    res.status(500).json({ message: "internal server error" });
  }
};
