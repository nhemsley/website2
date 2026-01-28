import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import fs from "fs";
import path from "path";

// Logging middleware plugin
function loggingPlugin() {
  return {
    name: "logging-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/log" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const logData = JSON.parse(body);
              const timestamp = new Date().toISOString();
              const logDir = path.join(process.cwd(), "tmp", "logs");
              const logFile = path.join(
                logDir,
                `viz-${new Date().toISOString().split("T")[0]}.log`,
              );

              // Ensure logs directory exists
              if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
              }

              // Format log entry with data
              const dataStr =
                logData.data && Object.keys(logData.data).length > 0
                  ? ` ${JSON.stringify(logData.data)}`
                  : "";
              const logEntry = `[${timestamp}] [${logData.level || "INFO"}] ${logData.message}${dataStr}\n`;

              // Append to log file
              fs.appendFileSync(logFile, logEntry);

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              console.error("Logging error:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), loggingPlugin()],
});
