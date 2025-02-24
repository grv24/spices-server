import { Request, Response } from "express";
import { OfferService } from "../services";

const offerService = new OfferService();

export class OfferController {
  async createOffer(req: Request, res: Response) {
    try {
      const offer = await offerService.createOffer(req.body);
      return res.status(201).json({ success: true, data: offer });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllOffers(req: Request, res: Response) {
    try {
      const offers = await offerService.getAllOffers();
      return res.status(200).json({ success: true, data: offers });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getActiveOffers(req: Request, res: Response) {
    try {
       
      const offers = await offerService.getActiveOffers();
      return res.status(200).json({ success: true, data: offers });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOfferById(req: Request, res: Response) {
    try {
      const offer = await offerService.getOfferById(req.params.id);
      if (!offer)
        return res
          .status(404)
          .json({ success: false, message: "Offer not found" });

      return res.status(200).json({ success: true, data: offer });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateOffer(req: Request, res: Response) {
    try {
      const offer = await offerService.updateOffer(req.params.id, req.body);
      if (!offer)
        return res
          .status(404)
          .json({ success: false, message: "Offer not found" });

      return res.status(200).json({ success: true, data: offer });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteOffer(req: Request, res: Response) {
    try {
      const offer = await offerService.deleteOffer(req.params.id);
      if (!offer)
        return res
          .status(404)
          .json({ success: false, message: "Offer not found" });

      return res
        .status(200)
        .json({ success: true, message: "Offer deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
