import mongoose from "mongoose";
import logger from '../logger/logger.js'



const db = () => {
  mongoose
  .connect(process.env.DEV_DATABASE)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error: ", error);
  });
}


  export default db