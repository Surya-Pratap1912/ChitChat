const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },

  admin: {
    type: String,
    required: true,
  },

  messeges: [
    {
      text: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      sentBy: {
        type: String,
        required: true,
      },
      receivedBy: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      groupName:{
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    },
  ],
  users: [
    {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    
  ],
});

groupSchema.methods.getusers = function () {
  return this.users;
};

groupSchema.methods.addUser = function (user) {
  console.log(user);
  this.users.push(user);
  return this.save();
};
groupSchema.methods.removeUser = function (user) {
  console.log(user);
  const newusrs = this.users.filter(u => user._id.toString() !== u._id.toString());
  this.users = newusrs;
  return this.save();
};

module.exports = mongoose.model("groups", groupSchema);
