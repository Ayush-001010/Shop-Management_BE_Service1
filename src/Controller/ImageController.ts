import { Request, Response } from "express";
import path from "path";

export const getImage = async (req: Request, res: Response) => {
  try {
    const imageName = req.params.name;
    const imagePath = path.join(__dirname, './Image', imageName);
    return res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).send('Image not found');
      }
    });
  } catch (error) {
    console.log("Error  ", error);
    return res.send({ success: false });
  }
};