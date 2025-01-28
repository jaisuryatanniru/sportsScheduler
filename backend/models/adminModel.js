const mongoose = require('mongoose');




const AdminSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    address: {
        type: Array,
        required: [true, "Address is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        
    },
    usertype: {
        type: String,
        required: [true, "User type is required"],
        default: 'admin',
        enum: ["admin","player"]
    },

    answer:{
        type:String,
        required:[true,"answer is required"]
    }

});





const Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
    Admin
    
}