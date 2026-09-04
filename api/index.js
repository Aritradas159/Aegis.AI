// Vercel discovers any file under /api as a serverless function. This one
// just re-exports the same Express app used for local dev (server/index.js)
// — that file guards its app.listen() behind `!process.env.VERCEL`, so on
// Vercel it never tries to bind a port; Vercel just calls the exported app
// directly as the request handler for every /api/* request (see the root
// vercel.json rewrite).
export { default } from '../server/index.js';
