// const db = require("./database");
const bcrypt = require("bcrypt");
// const userService = require("./api/Services/userService");
const db = require("./configuration/sequelize");
const User = db.users;

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const id = req.params.userId;
    const encoded = req.get("Authorization");
    const decoded = Buffer.from(
      req.get("Authorization").split(" ")[1],
      "base64"
    ).toString();
    const [username, pass] = decoded.split(":");

    const authenticatedUser = await User.findOne({
      where: { username: username },
    });

    if (!authenticatedUser) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(
      pass,
      authenticatedUser.dataValues.password
    );

    if (!match) {
      return res.status(401).send({ message: "Unauthorized" });
    } else {
      if (authenticatedUser.dataValues.id != req.params.userId) {
        return res.status(403).send({ message: "Forbidden" });
      }
      next();
    }
  } else {
    return res.status(401).send({
      error: "Unauthorized: Missing auth headers",
    });
  }
};

module.exports = auth;