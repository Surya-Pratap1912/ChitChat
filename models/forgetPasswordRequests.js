const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Fpr = new Schema({
  uuid:{
    type: String,
    required: true, 
  },
  isactive: {
    type: Boolean,
    required: true,
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});

module.exports = mongoose.model("fprRequests", Fpr);
