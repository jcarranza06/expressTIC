const jwt = require("jsonwebtoken");

// Middleware de auth
exports.authenticate = (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid or expired token" });
        req.user = decoded; // Guarda los datos del usuario autenticado en `req.user`
        next(); // Continúa con la siguiente función en la ruta
    });
};