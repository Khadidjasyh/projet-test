const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        // Remove 'Bearer ' if present
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = {
    verifyToken
}; 