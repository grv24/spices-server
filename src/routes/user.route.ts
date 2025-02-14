import express, { Request, Response } from "express";
import { UserController } from "../controllers";
import { authenticateMiddleware } from "../middleware";
import passport from "passport";

const router = express.Router();

const userController = new UserController();
//regiter
router.post("/register", (req: Request, res: Response) =>
  userController.registerController(req, res)
);

//login
router.post("/login", (req: Request, res: Response) =>
  userController.loginController(req, res)
);
//logout
router.get("/logout", (req: Request, res: Response) =>
  userController.logoutController(req, res)
);

//change-password
router.post(
  "/change-password",
  authenticateMiddleware("user"),
  (req: Request, res: Response) =>
    userController.passwordChangeController(req, res)
);

// get all user
router.get("/all", (req: Request, res: Response) =>
  userController.getAllUserController(req, res)
);
//get user
router.get("/", authenticateMiddleware("user"), (req: Request, res: Response) =>
  userController.getUserCurrentController(req, res)
);

//update user
router.patch(
  "/",
  authenticateMiddleware("user"),
  (req: Request, res: Response) =>
    userController.updateUserCurrentController(req, res)
);

// ✅ Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google Callback Route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  userController.googleAuthCallbackController
);

export default router;
