const jwt = require('jsonwebtoken'); // Fixed typo: jsonwebtoken

module.exports = function (req, res, next) { // Fixed typo: exports
    // 1. Get the token from the request header 
    const authHeader = req.header('Authorization'); // Fixed typo: Authorization
    const token = authHeader && authHeader.split(' ')[1]; // Extracts token after "Bearer "
    
    // 2. If no token is found, reject the request 
    if (!token) {
        return res.status(401).json({ message: 'Access denied: No token provided.' }); // Fixed typo: denied
    }

    // 3. Verify the token using your secret key
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        
        // 4. Attach the verified user payload (which has the user ID) to the request
        req.user = verified; 
        
        // 5. Allow the request to move forward to the route!
        next(); 
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};