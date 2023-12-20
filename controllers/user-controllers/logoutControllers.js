const Users = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.logout = async (req, res, next) => {
  const { _id } = req.user;
  const user = await Users.findOne(_id);

  user.loggedIn = false;
  await user.save();
  res.redirect("/login");
};
