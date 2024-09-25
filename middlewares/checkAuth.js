const checkAuth = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const { token } = req.body;
  if (!token) {
    res.json({ error: "Please sign in first to access this page" });
  } else {
    jwt.verify(token, "shhhhh", (err, decoded) => {
      if (err) {
        res.json({ error: "Invalid data detected" });
      } else {
        res.json({ username: decoded.username, phone_no: decoded.phone_no, balance: decoded.balance });
        next();
      }
    });
  }
};

module.exports = checkAuth;
