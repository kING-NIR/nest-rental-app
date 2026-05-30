// Logger utility for consistent logging across the application
enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatLog(level: LogLevel, message: string, data?: any, error?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
      ...(error && { error: error.message || error }),
    };
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      console.log(JSON.stringify(entry, null, 2));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  error(message: string, error?: any, data?: any): void {
    const entry = this.formatLog(LogLevel.ERROR, message, data, error);
    this.output(entry);
  }

  warn(message: string, data?: any): void {
    const entry = this.formatLog(LogLevel.WARN, message, data);
    this.output(entry);
  }

  info(message: string, data?: any): void {
    const entry = this.formatLog(LogLevel.INFO, message, data);
    this.output(entry);
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      const entry = this.formatLog(LogLevel.DEBUG, message, data);
      this.output(entry);
    }
  }
}

export default new Logger();
