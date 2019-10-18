import Koa from 'koa';
import passport from 'koa-passport';
import session from 'koa-session';

const { APP_SECRET } = process.env;

export function initiateAuth(app: Koa) {
  app.keys = [APP_SECRET];
  app.use(session({}, app));

  app.use(passport.initialize());
  app.use(passport.session());
}

export async function ensureLoggedIn(ctx, next) {
  if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.redirect('/login');
  }
}

export function getUserId(ctx) {
  return ctx.state.user.id;
}
