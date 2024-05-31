const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            status: 'ERR',
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(400).json({
            status: 'ERR',
            message: 'Invalid token.'
        });
    }
};

module.exports = authMiddleware;
