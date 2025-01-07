const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token must be Bearer token' });
        }

        const token = authHeader.split(' ')[1].trim();
        
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }

            req.user = user;
            next();
        } catch (jwtError) {
            return res.status(401).json({ 
                message: 'Invalid or expired token',
                error: jwtError.name
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            message: 'Server Error', 
            error: error.message 
        });
    }
};

module.exports = authMiddleware;
