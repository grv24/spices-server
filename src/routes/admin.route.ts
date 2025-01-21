import express, { Request, Response } from "express";
import { authenticateMiddleware } from "../middleware";
import { AdminController } from "../controllers/admin.controller";

const router = express.Router();
// controller
const adminController = new AdminController();

//regiter
router.post("/register", (req: Request, res: Response) =>
  adminController.registerController(req, res)
);

//login
router.post("/login", (req: Request, res: Response) =>
  adminController.loginController(req, res)
);

//get current admin
router.get("/", authenticateMiddleware("admin"),(req: Request, res: Response) =>
  adminController.getAdminCurrentController(req, res)
);

export default router;
