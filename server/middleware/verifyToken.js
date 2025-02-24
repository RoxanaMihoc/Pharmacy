import { promisify } from "util";
import { verify } from 'jsonwebtoken';

export async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = await promisify(verify)(token, process.env.SECRET_KEY);
        req.currentUser = decoded.userId; 
        req.role = decoded.role; 
        next();

    } catch (err) {
        return res.status(403).json({ error: "Invalid Token" });
    }
}



