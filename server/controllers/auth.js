const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist." });

    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isCorrectPassword)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "YOURSECRET",
      { expiresIn: "8h" }
    );
    return res.status(200).json({ result: existingUser, token });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const signUp = async (req, res) => {
  const { email, password, firstname, lastname, cpassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(404)
        .json({ message: "User already exist. Try logging in." });
    if (password !== cpassword)
      return res.status(404).json({ message: "Passwords must match." });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstname} ${lastname}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      "YOURSECRET",
      { expiresIn: "8h" }
    );
    return res.status(200).json({ result, token });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = { signIn, signUp };
