import { Router } from "express";

import userController from "./user.controller.js";
import validateRequest from "@app/middleware/validateRequest.js";
import userValidationSchema from "./user.validation.js";

const router = Router();

router.post(
	"/register",
	validateRequest(userValidationSchema.create),
	userController.createUser,
);

const userRoutes: Router = router;
export default userRoutes;
