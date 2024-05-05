// start.js
import app from "./server.js";
import logger from './logger/logger.js'


app.listen(process.env.PORT, () => {
  logger.info("server is running");
});

// app.listen(3000);
