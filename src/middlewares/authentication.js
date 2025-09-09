import jwt from "jsonwebtoken";

const { verify } = jwt;

// eslint-disable-next-line node/no-process-env
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function isLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "token" });
    }

    const deCoded = verify(token, JWT_SECRET);
    req.currentUser = deCoded;// create a currentUser object in the request
    next();
  }
  catch (e) {
    res.status(500).json(e);
  }
}

export default isLoggedIn;
