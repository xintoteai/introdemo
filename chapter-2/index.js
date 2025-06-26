// index.js
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const isDev      = process.env.NODE_ENV !== 'production';
const PORT       = process.env.PORT || 5000;

async function start() {
  const app = express();

  // Log all requests in dev-friendly format
  app.use(morgan('dev'));

  // JSON body parsing
  app.use(express.json());

  if (isDev) {
    // Mount Vite’s middleware for HMR, ES modules, etc.
    const vite = await createViteServer({
      server: { middlewareMode: 'ssr' },
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    // Serve your built frontend
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // Simple API route
  app.get('/api/hello', (req, res) => {
    console.log('GET /api/hello');
    res.json({ message: 'Hello from Express + Vite!' });
  });

  // Example POST that spawns a Python script
  app.post('/api/process', (req, res) => {
    const py = spawn('python3', ['server/python/process.py']);
    let output = '';

    py.stdout.on('data', chunk => { output += chunk; });
    py.stderr.on('data', err => console.error(err.toString()));

    py.on('close', code => {
      if (code !== 0) return res.status(500).send('Python script failed');
      res.json(JSON.parse(output));
    });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
