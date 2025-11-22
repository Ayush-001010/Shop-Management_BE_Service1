import { Request, Response } from "express";
import model from "../../Sequelize/model";
import { col, fn } from "sequelize";
import { getFileURL } from "../AWS/aws-operation";
import Fuse from 'fuse.js';

export const getCategoryAndSubCategory = async (req: Request, res: Response) => {
    try {
        const { type, Category } = req.query;
        switch (type) {
            case "Category": {
                const data = await model.Category.findAll({
                    attributes: [[fn("DISTINCT", col("Type")), "Type"]],
                    raw: true
                });
                return res.send({ success: true, data: data.map((item: any) => item.Type) });
            }
            case "SubCategory": {
                const data = await model.Category.findAll({
                    where: {
                        Type: Category
                    },
                    attributes: [[fn("DISTINCT", col("SubType")), "SubType"]],
                    raw: true
                });
                return res.send({ success: true, data: data.map((item: any) => item.SubType) });
            }
        }
        return res.send({ success: false, data: "Type Does Not Match!!" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getImageURL = async (req: Request, res: Response) => {
    try {
        const { baseURL } = req.body;
        const url = await getFileURL(baseURL);
        return res.send({ success: true, data: url });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getCategoryAndSubCategoryForLandingPage = async (req: Request, res: Response) => {
    try {
        const { type, shopID } = req.body;
        switch (type) {
            case "Category": {
                const data = await model.ProductInventory.findAll({
                    where: {
                        ShopDetailID: shopID
                    },
                    attributes: [[fn("DISTINCT", col("CategoryType")), "CategoryType"]],
                    raw: true
                });
                const uniqueCategory = data.map((item: any) => item.CategoryType);
                const arr = [];
                for (const item of uniqueCategory) {
                    const data1 = await model.Category.findAll({
                        where: {
                            Type: item
                        }
                    });
                    if (data1.length > 0) {
                        const url = data1[0].dataValues.CategoryImageURL;
                        const imageURL = await getFileURL(url);
                        arr.push({ Category: item, ImageURL: imageURL });
                    }
                }
                return res.send({ success: true, data: arr });
            }
        }
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getSubCategoryItem = async (req: Request, res: Response) => {
    try {
        const { Category, SubCategory, pageNo, shopID } = req.body;
        const pageSize = 6;
        const data = await model.ProductInventory.findAll({
            where: {
                CategoryType: Category,
                SubCategoryType: SubCategory,
                ShopDetailID: shopID
            },
            limit: 6,
            offset: pageSize * pageNo,
            attributes: ["ProductName", "CategoryType", "SubCategoryType", "ShopDetailID", "ProductDescription", "CostToBuy", "PerItemProfit", "ProductImagesURL"]
        });

        const arr = [];

        for (const item of data) {
            const { ProductImagesURL } = item;
            let obj = { ...item.dataValues };
            const urls = [];
            for (const baseURL of ProductImagesURL.split("||")) {
                const url = await getFileURL(baseURL);
                urls.push(url);
            }
            obj["ImageURLs"] = urls;
            arr.push(obj);
        }

        return res.send({ success: true, data: arr })
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getSearchItems = async (req: Request, res: Response) => {
    try {
        const { searchStr, shopID } = req.body;
        const prd = await model.ProductInventory.findAll({
            where: {
                ShopDetailID: shopID
            }
        });
        const fuse = new Fuse(prd, {
            keys: ["ProductName"],
            threshold: 0.3
        });
        const result = fuse.search(searchStr).map((result) => result.item);
        return res.send({ success: true, data: result.map((item: any) => item.ProductName) });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getFilterItems = async (req: Request, res: Response) => {
    try {
        const { type } = req.body;
        switch (type) {
            case "Category_Section": {
                const { ShopId, Category } = req.body;
                const data = await model.CategoryFilters.findAll({
                    where: {
                        Type: Category,
                        ShopDetailID: ShopId
                    }
                });
                return res.send({ success: true, data: data[0] });
            }
            case "Category_Price_Range": {
                const { ShopId, Category } = req.body;
                const minimumValue = await model.ProductInventory.min("PerItemPrice", {
                    where: {
                        CategoryType: Category,
                        ShopDetailID: ShopId
                    }
                });
                const maximumValue = await model.ProductInventory.max("PerItemPrice", {
                    where: {
                        CategoryType: Category,
                        ShopDetailID: ShopId
                    }
                });
                return res.send({
                    success: true, data: {
                        min: minimumValue,
                        max: maximumValue
                    }
                });
            }
            case "Category_BrandNames": {
                const { ShopId, Category } = req.body;
                const data = await model.ProductInventory.findAll({
                    where: {
                        CategoryType: Category,
                        ShopDetailID: ShopId
                    },
                    attributes: [[fn("DISTINCT", col("CompanyName")), "CompanyName"]],
                    raw: true
                });
                return res.send({ success: true, data: data.map((item: any) => item.CompanyName) });
            }
            case "Category_SubCategory": {
                const { ShopId, Category } = req.body;
                const data = await model.ProductInventory.findAll({
                    where: {
                        CategoryType: Category,
                        ShopDetailID: ShopId
                    },
                    attributes: [[fn("DISTINCT", col("SubCategory")), "SubCategory"]],
                    raw: true
                });
                return res.send({ success: true, data: data.map((item: any) => item.SubCategory) });
            }
        }
        return res.send({ success: false, data: "Type Does Not Match!!" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getItems = async (req: Request, res: Response) => {
    try {
        const { type } = req.body;
        switch (type) {
            case "Category_Items": {
                const { ShopId, Category, pageNo } = req.body;
                const pageSize = 6;
                const data = await model.ProductInventory.findAll({
                    where: {
                        ShopDetailID: ShopId,
                        CategoryType: Category
                    },
                    offset: pageSize * pageNo,
                    limit: pageSize
                });
                for (const item of data) {
                    const url: Array<string> = item.dataValues.ProductImagesURL.split("||");
                    item.dataValues.ProductImagesURL = [];
                    for (const baseURL of url) {
                        const fileURL = await getFileURL(baseURL);
                        item.dataValues.ProductImagesURL.push(fileURL);
                    }
                }
                return res.send({ success: true, data });
            }
        }
        return res.send({ success: false, data: "Type Does Not Match!!" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getItemSchema = async (req: Request, res: Response) => {
    try {
        const { ShopId } = req.body;
        const data = await model.ItemSchema.findAll({
            where: {
                ShopDetailID: ShopId
            }
        });
        return res.send({ success: true, data: data[0].ItemUIType });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}