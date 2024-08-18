const jwt = require("jsonwebtoken");
const User = require("../schema/contactSchema");

// Middleware for JWT authentication
const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken; // Assuming the token is in a cookie
    if (!token) {
      throw new Error("Authentication token missing");
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

module.exports = Authenticate;
