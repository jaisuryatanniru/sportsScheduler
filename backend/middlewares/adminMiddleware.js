const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization; 
    
    console.log("Authorization header:", token); 
    
    if (!token) {
        console.log("Token missing or not provided.");
        return res.status(401).json({ msg: "Token missing or not provided" });
    }

    const words = token.split(" "); 
    console.log("Split token:", words); 

    if (words.length !== 2 || words[0] !== "Bearer") {
        console.log("Invalid token format.");
        return res.status(400).json({ msg: "Invalid token format" });
    }

    const jwtToken = words[1];
    console.log("JWT Token:", jwtToken);

    try {
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        console.log("Decoded Token:", decodedValue); 
        
        if (decodedValue.username) {
            req.user = decodedValue;  
            console.log("Authenticated user:", decodedValue.username);
            next(); 
        } else {
            console.log("No username in decoded token.");
            res.status(403).json({
                msg: "You are not authenticated"
            });
        }
    } catch (e) {
        console.log("Token verification failed:", e.message);
        res.status(401).json({
            msg: "Invalid or expired token"
        });
    }
}

module.exports = adminMiddleware;
