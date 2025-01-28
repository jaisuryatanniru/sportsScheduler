const express = require('express');
const { adminRegisterController, adminLoginController, adminResetPasswordController } = require('../controllers/adminAuth');
const {createSport}=require('../controllers/sportsController');
const {createSession}=require('../controllers/sessionsController');
const {getReports}=require('../controllers/reportsController');

const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();


router.post('/adminRegister', adminRegisterController); 
router.post('/adminLogin', adminLoginController);

router.post('/adminResetPassword', adminResetPasswordController);  
router.post('/createSport',createSport);
router.post('/createSession',createSession);
router.get('/getReports',getReports);



module.exports = router;
