import jwt from "jsonwebtoken";

export const checkToken = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res
          .status(401)
          .json("you are not authorized to use this route.");
      }

      var decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "You don't have permission to access this route." });
      }
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "Jwt token is not valid.",
      });
    }
  };
};
