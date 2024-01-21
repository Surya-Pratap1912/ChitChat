const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email :{
    type: String,
    required: true
  },
  phone :{
    type: String,
    required: true
  },
  userName :{
    type: String,
    required: true
  },
  password :{
    type: String,
    required: true
  },
  loggedIn :{
    type: Boolean,
    required: true
  },
  groups:[{
      groupName: {
        type: String,
        ref: 'groups'
      }
    }]
  
})


userSchema.methods.getGroups = function (){
  return this.groups;
       
}

userSchema.methods.addGroup = function (group){
  console.log(group);
  this.groups.push(group);
  return this.save();
       
}
userSchema.methods.removeGroup = function (group){
  console.log(group);
  const newGroups = this.groups.filter(g=>{
    console.log(g._id.toString(),group._id.toString());
    return g._id.toString()!== group._id.toString();
  });
  
  this.groups = newGroups;
  return this.save();
       
}


module.exports = mongoose.model('Users',userSchema);
