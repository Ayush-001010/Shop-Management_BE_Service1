import { Request, Response } from "express";
import model from "../../Sequelize/model";

export const getProductTypes = async (req: Request, res: Response) => {
    try {
        const data = await model.ProductType.findAll();
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}