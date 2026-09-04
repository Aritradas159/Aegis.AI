import crypto from 'node:crypto';

// There is no login/signup and no database. This middleware only assigns a
// random per-browser id via a cookie so the in-memory demo history (see
// services/store.js) doesn't get shared across every visitor. It verifies
// nothing and gates nothing — it is not authentication.
export function attachSession(req, res, next) {
  let sessionId = req.cookies?.sessionId;
  if (!sessionId || !/^[a-f0-9]{24}$/.test(sessionId)) {
    sessionId = crypto.randomBytes(12).toString('hex');
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000
    });
  }
  req.sessionId = sessionId;
  next();
}
