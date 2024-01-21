
const Users = require("../../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





function generateAccessToken (id, /* ispremiumuser */)
{
  return jwt.sign({userId : id, /* ispremiumuser */ }, /*secret code  */ '2ih8y93jdb8y!EDWD2#jihajx73$5%(83990');
}

exports.login = async (req, res, nex) => {
  const {mail, password } = req.body;
  
  // // console.log(password);
  const user = await Users.findOne({'email':mail});


    //   // console.log(typeof(user.password));
    if (user ) {
      
      bcrypt.compare(password, user.password, async (err ,  result )=>{
        if(err)
        {
          // console.log(err);
          res.status(500).json({success: false , message  : 'something went wrong'});
        }
        else{
          if(result)
          {
            user.loggedIn = true;
            user.save();
            // // console.log("user -------------->  ",user.loggedIn);

              res.status(201).json({success :  true, user :user.userName,userName : user.userName,  message : `${user.userName} logged in successfully`, token : generateAccessToken(mail /*,user.ispremiumuser */)});
            }
            else{
              res.status(200).json({success: false , message: 'password is incorrect'});
            }
          }
        })

       
      } else {
        res.status(200).json({message: "user doesn't exist, please sign up"});
      }
    

//   res.send("a gya");
};