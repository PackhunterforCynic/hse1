import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import contactHandler from "./api/contact.js";
import chatHandler from "./api/chat.js";
import internshipHandler from "./api/internship.js";
import internshipRolesHandler from "./api/internshipRoles.js";

// Custom plugin to run Vercel API routes locally in Vite dev server
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // Security Shield: Block direct URL viewing of confidential studio repositories
      if (req.url && req.url.match(/\/(chats-history|contact-leads|internships-archive|chat|strategy)\.(json|txt)(\?.*)?$/i)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<div style="background:#050505;color:#ef4444;font-family:-apple-system,BlinkMacSystemFont,monospace;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;margin:0;">' +
                '<div style="border:1px solid #ef444433;padding:2.5rem 3rem;border-radius:1.5rem;background:#080808;box-shadow:0 0 40px rgba(239,68,68,0.2);max-width:620px;">' +
                '<div style="font-size:2rem;margin-bottom:1rem;">🛡️</div>' +
                '<h1 style="font-size:1.75rem;letter-spacing:0.2em;margin-bottom:0.75rem;color:#ef4444;font-family:monospace;">403 FORBIDDEN</h1>' +
                '<p style="color:#efe6d2;font-size:1.05rem;margin-bottom:0.75rem;font-weight:600;letter-spacing:0.05em;">HAVILAH STUDIO CONFIDENTIAL VAULT</p>' +
                '<p style="color:#9ca3af;font-size:0.875rem;line-height:1.6;">Access Denied: Direct HTTP retrieval of confidential client consultative telemetry, contact CRM leads, and talent recruitment dossiers is strictly restricted by executive security protocol.</p>' +
                '<a href="/" style="display:inline-block;margin-top:1.5rem;padding:0.65rem 1.5rem;background:#efe6d2;color:#000;text-decoration:none;border-radius:0.75rem;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Return to Website</a>' +
                '</div></div>');
        return;
      }

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
            if (!res.headersSent) {
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.end();
            }
          }
        });
      } else if (req.url === '/api/internship' && req.method === 'POST') {
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
            await internshipHandler(req, res);
          } catch (err) {
            if (!res.headersSent) {
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.end();
            }
          }
        });
      } else if (req.url === '/api/internship-roles' && req.method === 'GET') {
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          await internshipRolesHandler(req, res);
        } catch (err) {
          if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.end();
          }
        }
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
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      watch: {
        ignored: ['**/chats-history.json', '**/contact-leads.json', '**/internships-archive.json', '**/chat.json']
      }
    },
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