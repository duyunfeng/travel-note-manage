const jwt = require("jsonwebtoken");
const jwtMiddleware = require("express-jwt");
const { generateSecureToken } = require("./utils");

const secretKey = generateSecureToken();
// 创建JWT
function createToken(user) {
  return jwt.sign(user, secretKey, { algorithm: "HS256" });
}
// 中间件来解析JWT
const authMiddleware = jwtMiddleware.expressjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

module.exports = { secretKey, createToken, authMiddleware }