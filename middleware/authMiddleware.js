const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {



    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        next("Authentication failed")
    }
    if (authHeader) var token = authHeader.split(" ")[1];
    try {
        // eslint-disable-next-line no-undef
        const payload = await jwt.verify(token, process.env.SECRET_TOKEN)
        req.user = { userId: payload.userId }
        next()
    } catch (error) {
        next(error);
    }
}

module.exports = authMiddleware