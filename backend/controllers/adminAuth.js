const {Admin}= require("../models/adminModel")

const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");



require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;


  const adminRegisterController = async (req, res) => {
    try {
      const { username, email, password, phone, address,usertype,answer} = req.body;
  
      if (!username || !email || !password || !address || !phone||!usertype||!answer) {
        return res.status(400).send({
          success: false,
          message: "Please provide all details",
        });
      }
  
      const existing = await Admin.findOne({ email });
      if (existing) {
        return res.status(409).send({
          success: false,
          message: "Email already taken",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await Admin.create({
        username,
        email,
        password: hashedPassword,
        address,
        phone,
        usertype,
        answer
        
      });
  
      res.status(201).send({
        success: true,
        message: "Successfully registered",
        user: { id: user._id, username: user.username, email: user.email }, 
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in register API",
      });
    }
  };
  
  
  
  
  const adminLoginController = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "Please provide email and password",
        });
      }
  
      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: "Invalid credentials",
        });
      }
  
      const token = JWT.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  
      res.status(200).send({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, userName: user.userName, email: user.email }, 
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login API",
      });
    }
  };

  
const adminResetPasswordController=async(req,res)=>{
    try{
      const{email,newpassword,answer}=req.body;
      if(!email||!newpassword || !answer){
        return res.status(500).send({
          success:false,
          message:"please provide all fields"
        })
      }
    
      const user = await Admin.findOne({email,answer})
      if(!user){
        return res.status(500).send({
          success:false,
          message:"user not found or invalid answer"
    
        })
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password=hashedPassword
      await user.save();
      return res.status(200).send({
        success:true,
        message:"password reset is successful"})
    
    
    
    }
    catch(error){
      console.log(error);
      res.status(500).send({
        success:false,
        message:"error in Password reset api",
        error
      })
    }
    };
    
    
    module.exports = {  adminRegisterController,adminLoginController ,adminResetPasswordController};
