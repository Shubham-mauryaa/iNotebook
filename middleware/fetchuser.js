const jwt = require('jsonwebtoken')
const JWT_SECRET = "I am $hubham"

const fetchuser = (req, res, next) => {
    //gett the user from the jwt token and add id to req object
    const token = req.header('auth-token')
    if (!token) {
        req.status(401).send({ error: "Please authenticate using valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        req.status(401).send({ error: "Please authenticate using valid token" });
    }

}

module.exports = fetchuser;