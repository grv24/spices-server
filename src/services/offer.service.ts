import { Offer, IOffer } from "../models";

export class OfferService {
  async createOffer(data: Partial<IOffer>) {
    return await Offer.create(data);
  }

  async getAllOffers() {
    return await Offer.find();
  }

  async getActiveOffers() {
    return await Offer.find({ isActive: true });
  }

  async getOfferById(offerId: string) {
    return await Offer.findById(offerId);
  }

  async updateOffer(offerId: string, data: Partial<IOffer>) {
    return await Offer.findByIdAndUpdate(offerId, data, { new: true });
  }

  async deleteOffer(offerId: string) {
    return await Offer.findByIdAndDelete(offerId);
  }
}


