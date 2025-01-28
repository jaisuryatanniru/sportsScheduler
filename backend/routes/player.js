const express = require('express');
const { playerRegisterController,  playerResetPasswordController,PlayerLoginController } = require('../controllers/playerAuth');
const {createSession}=require('../controllers/sessionsController');


const playerMiddleware=require("../middlewares/playerMiddleware");
const router = express.Router();



router.post('/playerResetPassword',  playerResetPasswordController);  
router.post('/playerRegister',playerRegisterController);  
router.post('/playerLogin',  PlayerLoginController); 
router.post('/createSession',createSession);


module.exports = router;

