import { Request, Response } from "express";
import { User } from "../models/user.model";

const mockUser: User = {
  id: 1,
  name: "Gourav Mahobe",
  email: "gourav.mahobe@example.com",
};

const getUser = (_req: Request, res: Response) => {
  res.json(mockUser);
};

export { getUser };
