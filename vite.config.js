import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import contactHandler from "./api/contact.js";
import chatHandler from "./api/chat.js";

// Custom plugin to run Vercel API routes locally in Vite dev server
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/contact' && req.method === 'POST') {
        // Parse JSON body
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch (e) {
            req.body = {};
          }

          // Mock Vercel response helpers
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          // Execute the serverless function
          try {
            await contactHandler(req, res);
          } catch (err) {
            console.error('API Error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        });
      } else if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch (e) {
            req.body = {};
          }

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          try {
            await chatHandler(req, res);
          } catch (err) {
            console.error('Chat API Error:', err);
            if (!res.headersSent) {
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.end();
            }
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  // Load env variables into process.env so our backend function can read them locally
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      reactRouter(),
      tailwindcss(),
      vercelApiPlugin()
    ],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});