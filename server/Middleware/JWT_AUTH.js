const jwt = require('jsonwebtoken')

const JWT_AUTH = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(403).json({ msg: "JWT not provided." })
        }
        const decodedData = jwt.verify(token.split(" ")[1], process.env.SECRET)
        req.decodedData = decodedData
        next();

    } catch (err) {
        return res.status(401).json({ msg: "Invalid JWT token." })
    }
}


module.exports = { JWT_AUTH }