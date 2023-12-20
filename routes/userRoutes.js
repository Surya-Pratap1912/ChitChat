const express = require('express');
const path = require('path');
const router = express.Router();
const signUp = require('../controllers/user-controllers/signUpControllers');
const login  = require('../controllers/user-controllers/loginControllers');
const logout  = require('../controllers/user-controllers/logoutControllers');
const forgetPass = require('../controllers/user-controllers/forgetPasswordControllers');
const userAuth = require('../middlewares/auth');

//navigations

 router.get('/',(req, res, next)=>{
     res.redirect('/signup')
     // res.sendFile(path.join(__dirname,'..','client/public/sign_up','index.html'));
 })

 router.get('/signup',(req, res, next)=>{
    res.sendFile(path.join(__dirname,'..','views','signUp.html'));
  // res.redirect('/login')
    // res.sendFile(path.join(__dirname,'..','client/public/sign_up','index.html'));
})

router.post('/users/signUp', signUp.signUp);

router.get('/login',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','login.html'));
  })

  router.post('/users/login', login.login);


router.get('/logout',userAuth.Authenticate , logout.logout )
 
  router.get('/forget-password',(req, res, next)=>{
      res.sendFile(path.join(__dirname,'..','views','forget-password.html'));
      // res.sendFile(path.join(__dirname,'..','client/public/sign_up','index.html'));
  })

  router.get('/dashboard',(req, res, next)=>{
      res.sendFile(path.join(__dirname,'..','views','dashboard.html'));
      // res.sendFile(path.join(__dirname,'..','client/public/sign_up','index.html'));
  })


router.post('/password/forget-password',forgetPass.forgetPass);
router.get('/password/resetpassword/:uu_id',forgetPass.resetPass);
router.post('/password/resetpassword',forgetPass.changePass);

module.exports = router;