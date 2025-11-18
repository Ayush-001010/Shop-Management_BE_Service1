import { Request, Response } from "express";
import model from "../../Sequelize/model";

export const createLayout = async (req: Request, res: Response) => {
    try {
        const { sectionSchema, itemSchema } = req.body;
        console.log("Section Schema ", sectionSchema);
        console.log("Item Schema ", itemSchema);
        await sectionSchema.forEach(async (layout: any) => {
            await model.SectionSchema.create({ ...layout });
        });
        await model.ItemSchema.create({ ...itemSchema });
        return res.send({ success: true });
    } catch (error) {
        console.log("Error ", error);
        return res.send({ success: false });
    }
}

export const checkLayoutIsAlreadyPresent = async (req: Request, res: Response) => {
    try {
        const { organizationId, shopId } = req.body;
        const count = await model.SectionSchema.count({
            where: {
                organizationdetailstableID: organizationId,
                ShopDetailID: shopId
            }
        });

        return res.send({ success: true, data: count > 0 });
    } catch (error) {
        console.log("Error ", error);
        return res.send({ success: false });
    }
}

export const getSectionSchemaAndItemSchema = async (req: Request, res: Response) => {
    try {
        const { OrganizationID, ShopID } = req.body;

        const sectionSchema = await model.SectionSchema.findAll({
            where: {
                organizationdetailstableID: OrganizationID,
                ShopDetailID: ShopID
            },
            order:[["SerialNumber","ASC"]]
        });
        const itemSchema = await model.ItemSchema.findAll({
            where: {
                organizationdetailstableID: OrganizationID,
                ShopDetailID: ShopID
            }
        });

        return res.send({ success: true, data: { sectionSchema, itemSchema : itemSchema[0] } });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}