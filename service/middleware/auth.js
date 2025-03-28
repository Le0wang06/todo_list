const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                code: 401,
                msg: 'No authorization header',
                data: null
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                code: 401,
                msg: 'No token provided',
                data: null
            });
        }

        const decoded = jwt.verify(token, 'your-secret-key'); // In production, use environment variable
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            code: 401,
            msg: 'Invalid token',
            data: null
        });
    }
};

module.exports = authMiddleware; 