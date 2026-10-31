// logger.js

import { createLogger, format, transports } from 'winston';
import path from 'path';

// Define log format
const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  level: 'info', // Minimum level to log
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Log errors to error.log
    new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    // Log all info and above to combined.log
    new transports.File({ filename: path.join('logs', 'combined.log') }),
    // Additionally, log to console in development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      ),
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join('logs', 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join('logs', 'rejections.log') })
  ]
});

export default logger;
