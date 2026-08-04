export const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'] || (req.user && req.user.role);
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};
