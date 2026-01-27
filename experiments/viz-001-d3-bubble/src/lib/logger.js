/**
 * Client-side logger that writes to both console and server filesystem
 */

class Logger {
  constructor() {
    this.endpoint = "/api/log";
    this.enabled = true;
    this.batchSize = 10;
    this.batchTimeout = 2000; // ms
    this.queue = [];
    this.timer = null;
  }

  /**
   * Send log to server
   */
  async sendToServer(level, message, data = {}) {
    if (!this.enabled) return;

    const logEntry = {
      level,
      message:
        typeof message === "string"
          ? message
          : JSON.stringify(message, null, 2),
      timestamp: new Date().toISOString(),
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.queue.push(logEntry);

    // Send immediately if queue is full, otherwise batch
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchTimeout);
    }
  }

  /**
   * Flush queued logs to server
   */
  async flush() {
    if (this.queue.length === 0) return;

    const logsToSend = [...this.queue];
    this.queue = [];

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      // Send each log (could batch these too)
      for (const log of logsToSend) {
        await fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
      }
    } catch (error) {
      console.error("Failed to send logs to server:", error);
    }
  }

  /**
   * Log methods
   */
  log(message, data) {
    console.log(message, data);
    this.sendToServer("INFO", message, data);
  }

  info(message, data) {
    console.info(message, data);
    this.sendToServer("INFO", message, data);
  }

  warn(message, data) {
    console.warn(message, data);
    this.sendToServer("WARN", message, data);
  }

  error(message, data) {
    console.error(message, data);
    this.sendToServer("ERROR", message, data);
  }

  debug(message, data) {
    console.debug(message, data);
    this.sendToServer("DEBUG", message, data);
  }

  /**
   * Enable/disable server logging
   */
  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

// Singleton instance
export const logger = new Logger();

// Also export a function to override native console
export function overrideConsole() {
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalDebug = console.debug;

  console.log = function (...args) {
    originalLog.apply(console, args);
    logger.sendToServer("INFO", args.join(" "));
  };

  console.info = function (...args) {
    originalInfo.apply(console, args);
    logger.sendToServer("INFO", args.join(" "));
  };

  console.warn = function (...args) {
    originalWarn.apply(console, args);
    logger.sendToServer("WARN", args.join(" "));
  };

  console.error = function (...args) {
    originalError.apply(console, args);
    logger.sendToServer("ERROR", args.join(" "));
  };

  console.debug = function (...args) {
    originalDebug.apply(console, args);
    logger.sendToServer("DEBUG", args.join(" "));
  };
}
