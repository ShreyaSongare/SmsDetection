const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken: token
  });

  const link = `http://localhost:5000/api/auth/verify/${token}`;

  await sendEmail(email, "Verify Email", `Click to verify: ${link}`);

  res.json({ message: "Verification email sent" });
};

exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token
  });

  if (!user) return res.status(400).send("Invalid token");

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.send("Email verified successfully");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  if (!user.isVerified)
    return res.status(401).send("Email not verified");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send("Invalid password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
};
