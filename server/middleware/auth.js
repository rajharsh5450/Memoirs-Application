const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "YOURSECRET");

      req.userId = decodedData.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData.sub; //GOOgle oAuth's way of defining specific id:"sub"
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = auth;
