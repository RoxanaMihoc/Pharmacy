const { verify } = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        req.user = decoded;

        next();
    });
}


