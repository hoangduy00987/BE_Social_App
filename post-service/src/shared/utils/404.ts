import { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ details: "Route not found" });
};

export default notFoundHandler;
