const express = require('express');
const { playerRegisterController,  playerResetPasswordController,PlayerLoginController } = require('../controllers/playerAuth');
const { createSession, getSessions, joinSession, cancelSession, getMySessions } = require('../controllers/sessionsController');


const playerMiddleware=require("../middlewares/playerMiddleware");
const router = express.Router();



router.post('/playerResetPassword',  playerResetPasswordController);  
router.post('/playerRegister',playerRegisterController);  
router.post('/playerLogin',  PlayerLoginController); 
router.post('/createSession',createSession);


router.get('/getSessions', getSessions);
router.post('/joinSession/:sessionId', joinSession);
router.post('/cancelSession/:sessionId', cancelSession);
router.get('/mySessions', playerMiddleware, getMySessions);



module.exports = router;

