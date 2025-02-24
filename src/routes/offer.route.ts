import express, { Request, Response } from "express";
import { OfferController } from "../controllers";
import { authenticateMiddleware } from "../middleware";

const offerController = new OfferController();

const router = express.Router();

router.post(
  "/",
  authenticateMiddleware("admin"),
  (req: Request, res: Response) => offerController.createOffer(req, res)
);
router.get("/", (req: Request, res: Response) =>
  offerController.getAllOffers(req, res)
);
router.get("/active", (req: Request, res: Response) =>
  offerController.getActiveOffers(req, res)
);
router.get("/:id", (req: Request, res: Response) =>
  offerController.getOfferById(req, res)
);
router.put(
  "/:id",
  authenticateMiddleware("admin"),
  (req: Request, res: Response) => offerController.updateOffer(req, res)
);
router.delete(
  "/:id",
  authenticateMiddleware("admin"),
  (req: Request, res: Response) => offerController.deleteOffer(req, res)
);

export default router;
