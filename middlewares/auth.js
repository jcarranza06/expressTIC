const jwt = require("jsonwebtoken");
//middleware de auth
exports.authenticate = (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decoded; // Guarda los datos del usuario autenticado en `req.user`
        next(); // Continúa con la siguiente función en la ruta
    });
};

// Middleware para validar que el usrId en la solicitud sea el mismo que el autenticado
exports.verifyUserId = (req, res, next) => {
    const { usrId } = req.params || req.body; // Extraer usrId de params o body

    if (!usrId) {
        return res.status(400).json({ message: "usrId is required" });
    }

    if (usrId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized: User ID mismatch" });
    }

    next(); // Si pasa la validación, continúa con la ejecución
};
