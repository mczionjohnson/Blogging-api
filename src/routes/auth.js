import { Router } from "express";

import { generateMiddleWare } from "../middleware/route.middleware.js"
import { loginSchema, registerSchema } from "../middleware/validation/auth.validation.js"

import { authLogin, authSignup } from "../controllers/auth.controller.js"


const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome!" });
});

indexRouter.post("/signup", generateMiddleWare(registerSchema), authSignup)

indexRouter.post("/login", generateMiddleWare(loginSchema), authLogin)


export default indexRouter;
