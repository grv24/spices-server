import express, { Request, Response } from "express";
import { UserController } from "../controllers";

const router = express.Router();

const userController = new UserController();

router.post("/register", (req: Request, res: Response) =>
  userController.registerController(req, res)
);
router.post("/login", (req: Request, res: Response) =>
  userController.loginController(req, res)
);

export default router;
