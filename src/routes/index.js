import { Router } from "express";

import { generateMiddleWare } from "../middleware/loginSignup.middleware.js";
import {
  loginSchema,
  registerSchema,
} from "../middleware/validation/loginSignup.validation.js";

import { authLogin, authSignup } from "../controllers/auth.controller.js";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Whistling!" });
});

// plug the validation into
indexRouter.post("/register", generateMiddleWare(registerSchema), authSignup);

indexRouter.post("/login", generateMiddleWare(loginSchema), authLogin);

indexRouter.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

export default indexRouter;
