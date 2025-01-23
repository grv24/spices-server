import express, { Request, Response } from "express";
import { authenticateMiddleware } from "../middleware";
import multer from "multer";
import { BannerController } from "../controllers/banner.controller";

const router = express.Router();

export const storage = multer.memoryStorage();
export const upload = multer({ storage });

// controller
const bannerController = new BannerController();

// create banner
router.post(
  "/",
  authenticateMiddleware("admin"),
  upload.single("image"),
  (req: Request, res: Response) =>
    bannerController.createBannerController(req, res)
);

// update banner
router.patch(
  "/:id",
  authenticateMiddleware("admin"),
  upload.single("image"),
  (req: Request, res: Response) =>
    bannerController.updateBannerController(req, res)
);

// delete banner
router.delete("/:id", (req: Request, res: Response) =>
  bannerController.deleteBannerController(req, res)
);

// get all banners
router.get("/", (req: Request, res: Response) =>
  bannerController.getAllBannersController(req, res)
);

export default router;
