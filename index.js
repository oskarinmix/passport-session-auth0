import express from "express";
import cors from "cors";
import morgan from "morgan";
import setupPassport from "./config/setupPassport.js";
import passport from "passport";
import session from "express-session";
import redisStore from "./config//redisStore.js";
import authRoutes from "./routes/auth.js";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({}));
app.use(morgan("dev"));

setupPassport(passport);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "this_is_a_secret",
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    rolling: true, // forces resetting of max age
    cookie: {
      maxAge: process.env.EXPIRATION * 1000,
      secure: false, // this should be true only when you don't want to show it for security reason
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRoutes);
app.get("/", (req, res) => {
  res.send({ ok: true });
});

app.listen(PORT, (req, res) => {
  console.log(`APP LISTENING ON PORT ${PORT}`);
});
