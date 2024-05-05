import winston from "winston";
const { combine, timestamp, json, cli } = winston.format;

const logger = winston.createLogger({
  //   level: 'info',
  level: process.env.LOG_LEVEL || "info",
//   format: winston.format.cli(),
//   format: combine(timestamp(), json()),
  format: combine(timestamp(), cli()),
  transports: [new winston.transports.Console({format: winston.format.simple(),})],
});


// logger.add(new winston.transports.logger(options));

// log levels
// {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
//   }

export default logger;
