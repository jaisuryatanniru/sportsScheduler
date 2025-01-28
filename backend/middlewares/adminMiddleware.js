const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    const token = req.headers.authorization; // Bearer token
    
    console.log("Authorization header:", token); // Log the Authorization header
    
    // Check if token exists
    if (!token) {
        console.log("Token missing or not provided.");
        return res.status(401).json({ msg: "Token missing or not provided" });
    }

    const words = token.split(" "); // ["Bearer", "token"]
    console.log("Split token:", words); // Log the result of the split operation

    if (words.length !== 2 || words[0] !== "Bearer") {
        console.log("Invalid token format.");
        return res.status(400).json({ msg: "Invalid token format" });
    }

    const jwtToken = words[1]; // Extract token
    console.log("JWT Token:", jwtToken); // Log the token after extraction

    try {
        // Verify token
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        console.log("Decoded Token:", decodedValue); // Log decoded token
        
        if (decodedValue.username) {
            req.user = decodedValue;  // Attach decoded value to the request
            console.log("Authenticated user:", decodedValue.username);
            next(); // Pass control to the next handler (route)
        } else {
            console.log("No username in decoded token.");
            res.status(403).json({
                msg: "You are not authenticated"
            });
        }
    } catch (e) {
        console.log("Token verification failed:", e.message); // Log any error during verification
        res.status(401).json({
            msg: "Invalid or expired token"
        });
    }
}

module.exports = adminMiddleware;
