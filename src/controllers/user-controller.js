import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// eslint-disable-next-line node/no-process-env
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
    );

    return res.status(200).json({
      accessToken: token,
      userId: user._id,
      username: user.username,
    });
  }
  catch (err) {
    return res.status(500).json({ message: "An error occurred while creating the account.", error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
    );

    return res.status(200).json({
      accessToken: token,
      userId: user._id,
      username: user.username,
    });
  }
  catch (err) {
    return res.status(500).json({ message: "An error occurred while logging in.", error: err.message });
  }
}
