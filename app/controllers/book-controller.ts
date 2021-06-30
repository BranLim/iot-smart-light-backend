import { Request, Response } from "express";
import mongoose from "mongoose";
import Light from "../models/light";

const createLight = (req: Request, res: Response) => {
  let { name, ledCount } = req.body;

  const light = new Light({
    _id: new mongoose.Types.ObjectId(),
    name,
    ledCount,
  });
};
