import winston from "winston";
const { combine, timestamp, json, cli } = winston.format;

// const logger = winston.createLogger({
//   //   level: 'info',
//   level: process.env.LOG_LEVEL || "info",
// //   format: winston.format.cli(),
// //   format: combine(timestamp(), json()),
//   format: combine(timestamp(), cli()),
//   transports: [new winston.transports.Console({format: winston.format.simple(),})],
// });

const options = {
  file: {
      level: 'info',
      filename: './logs/app.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
  },
  console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      format: winston.format.simple()
  },
};

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: combine(timestamp(), json()),

  transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
  ],
  exitOnError: false
})




export default logger;
