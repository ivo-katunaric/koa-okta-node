import Router from 'koa-router';
import passport from 'koa-passport';
import { Strategy as OidcStrategy } from 'passport-openidconnect';
import {initiateAuth} from "./services";

const { OKTA_DOMAIN, CLIENT_ID, CLIENT_SECRET } = process.env;

passport.use('oidc', new OidcStrategy({
  issuer: `https://${OKTA_DOMAIN}/oauth2/default`,
  authorizationURL: `https://${OKTA_DOMAIN}/oauth2/default/v1/authorize`,
  tokenURL: `https://${OKTA_DOMAIN}/oauth2/default/v1/token`,
  userInfoURL: `https://${OKTA_DOMAIN}/oauth2/default/v1/userinfo`,
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/authorization-code/callback',
  scope: 'openid profile'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

const router = new Router<any, any>();

router.get('/login', passport.authenticate('oidc'));

router.get('/authorization-code/callback',
  passport.authenticate('oidc', { failureRedirect: '/error' }),
  ctx => {
    ctx.redirect('/');
  }
);

router.post('/logout', async ctx => {
  await ctx.logout();
  ctx.redirect('/');
});

export default app => {
  initiateAuth(app);
  app.use(router.routes());
}
