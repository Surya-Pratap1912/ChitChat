
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({

    text : {
        type: String,
        required: true
    },

    time : 
    {
        type: String,
        required: true
    },
    sentBy:
    {
        type: String,
        required: true
    },
    receivedBy:
    {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true    
    },
    groupName:{
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true  
     },
     userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
      }

})


module.exports = mongoose.model('messeges',messageSchema);
