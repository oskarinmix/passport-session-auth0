import { Router } from "express";
import passport from "passport";
import authenticateUser from "../middleware/authenticate.js";
const router = Router();
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  })
);
router.get("/auth/return", function (req, res, next) {
  passport.authenticate("auth0", {
    successRedirect: "/profile",
    failureRedirect: "/error",
  })(req, res, next);
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  req.user = null;
  res.redirect("/");
});
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("The User is Authenticated");
  } else {
    res.send("Authentication Failed");
  }
});
router.get("/profile", authenticateUser, (req, res) => {
  res.send(req.user);
});
router.get("/error", (req, res) => {
  res.send({ ok: false, error: "You are not authenticated" });
});

export default router;
