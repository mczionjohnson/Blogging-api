import logger from '../logger/logger.js'

export const generateMiddleWare = (schema) => {
    return (req, res, next) => {
      // Middleware logic
      if (schema) {
        const result = schema.validate(req.body);
        logger.info("validator", result);
        if (result.error) {
          logger.error(result.error)
          return res
            .status(422)
            .json({ message: "Validation error", errors: result.error });
        }
    }
      next();
    };
  };
  