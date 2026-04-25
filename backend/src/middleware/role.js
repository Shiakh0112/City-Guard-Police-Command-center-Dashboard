// Usage: router.delete("/:id", protect, requireRole("admin"), handler)
// requireRole("admin")          → only admin can access
// requireRole("admin","officer") → admin OR officer can access

module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: "Not authenticated" });

  if (!allowedRoles.includes(req.user.systemRole))
    return res.status(403).json({
      message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.systemRole}`
    });

  next();
};
