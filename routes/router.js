const express = require('express');
const path = require('path');
const router = express.Router();
const signUp = require('../controllers/user-controllers/signUpControllers');
const login  = require('../controllers/user-controllers/loginControllers');
const logout  = require('../controllers/user-controllers/logoutControllers');
const forgetPass = require('../controllers/user-controllers/forgetPasswordControllers');
const chatAppControllers = require('../controllers/chatAppControllers');
const userAuth = require('../middlewares/auth');



//chatAppControllers
router.post('/create-group',userAuth.Authenticate, chatAppControllers.createGroup);
router.delete('/delete-group',userAuth.Authenticate, chatAppControllers.deleteGroup);
router.get('/get-messeges',userAuth.Authenticate, chatAppControllers.getMesseges);
router.post('/group/add-user',userAuth.Authenticate, chatAppControllers.addUser);

router.get('/get-contacts',userAuth.Authenticate, chatAppControllers.getContacts);
router.get('/get-users',userAuth.Authenticate, chatAppControllers.getUsers);
router.delete('/remove-user', userAuth.Authenticate, chatAppControllers.removeUser)



module.exports = router;



