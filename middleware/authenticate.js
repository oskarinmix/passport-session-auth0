const authenticateUser = (req, res, next) => {
  if (!req.isAuthenticated()) res.redirect("/error");
  next();
};
export default authenticateUser;
