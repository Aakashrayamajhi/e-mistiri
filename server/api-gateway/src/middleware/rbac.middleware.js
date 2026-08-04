export const rbac = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user context found'
      })
    }

    const userRole = req.user.role

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden - Role '${userRole}' is not authorized to access this resource`
      })
    }

    next()
  }
}
