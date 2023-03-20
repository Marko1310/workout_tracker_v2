const jwt = require("jsonwebtoken");
const pool = require("../databse/db");

// get JWT token from the request and check is it is valid
const requiresAuth = async (req, res, next) => {
  const token = req.cookies["access-token"];
  let isAuthorized = false;

  if (token) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [
          userId,
        ]);

        if (user.rows.length !== 0) {
          const userCredentials = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
          };
          req.user = userCredentials;
          isAuthorized = true;
        }
      } catch {
        isAuthorized = false;
      }
    } catch {
      isAuthorized = false;
    }
  }
  if (isAuthorized) {
    return next();
  }

  return res.status(401).send("Unathorized");
};

module.exports = requiresAuth;
