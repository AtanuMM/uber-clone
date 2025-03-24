const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Add colors to winston
winston.addColors(colors);

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define where to store the logs
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // Error log file transport
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error'
  }),
  
  // All logs file transport
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log')
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
});

// Export a function to handle objects/errors
module.exports = {
  error: (err) => {
    if (typeof err === 'object' && err.message) {
      logger.error(err.message);
      if (err.stack) {
        logger.error(err.stack);
      }
    } else {
      logger.error(err);
    }
  },
  warn: (message) => logger.warn(message),
  info: (message) => logger.info(message),
  http: (message) => logger.http(message),
  debug: (message) => logger.debug(message),
  // Stream for Morgan middleware
  stream: {
    write: (message) => logger.http(message.trim())
  }
};