import xss from "xss";

export const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = JSON.parse(JSON.stringify(req.body), (key, value) => {
      if (typeof value === "string") {
        return xss(value);
      }
      return value;
    });
  }
  next();
};
