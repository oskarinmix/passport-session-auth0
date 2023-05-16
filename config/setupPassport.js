import passport from "passport";
import Auth0Strategy from "passport-auth0";
import "dotenv/config";
import jwt from "jsonwebtoken";
const auth0Options = {
  domain: process.env.AUTH0_DOMAIN || "blueeye.us.auth0.com",
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL,
  passReqToCallback: true,
  state: true,
};

const auth0Strategy = new Auth0Strategy(auth0Options, function (
  req,
  accessToken,
  refreshToken,
  extraParams,
  profile,
  done
) {
  console.log(extraParams);
  done(null, {
    user: {
      id: profile.id,
      user_id: profile.user_id,
      provider: profile.provider,
      ...profile._json,
    },
    access_token: extraParams.access_token,
    id_token: extraParams.id_token,
    refresh_token: refreshToken,
    scope: extraParams.scope,
    expires_in: extraParams.expires_in,
    token_type: extraParams.token_type,
  });
});

const setupPassport = async (passport) => {
  passport.serializeUser((payload, done) => {
    // let us = {
    //   id: user.id,
    //   name: user.displayName,
    //   email: user.emails[0].value,
    //   nickname: user.nickname,
    // };
    // const token = jwt.sign(us, process.env.JWT_SECRET || "this_is_a_secret", {
    //   expiresIn: process.env.EXPIRATION || 3600,
    // });
    // done(null, {
    //   token,
    //   loginTime: Date.now(),
    //   sessionExpiresAt: Date.now() + Number(process.env.EXPIRATION * 1000),
    // });
    done(null, {
      ...payload.user,
      access_token: payload.access_token,
      id_token: payload.id_token,
      refresh_token: payload.refresh_token,
    });
  });

  passport.deserializeUser(function (user, cb) {
    return cb(null, user);
  });
  passport.use(auth0Strategy);
};
export default setupPassport;
