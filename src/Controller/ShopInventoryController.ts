import { Request, Response } from "express";
import CreateContainerInterface from "../Config/Interface/CreateContainerInterface";
import model from "../../Sequelize/model";
import { Sequelize, Op, where } from "sequelize";

export const addContainer = async (req: Request, res: Response) => {
    try {
        const data: CreateContainerInterface = req.body.data;
        const shopID: number = req.body.ShopID;
        const res1 = await model.Container.create({
            Name: data.Name,
            Height: data.Height,
            Width: data.Width,
            NoOfRows: data.NoOfRows.length,
            ShopDetailID: shopID,
            Depth: data.Depth
        });
        let colNumber: number = 0;
        for (const item of data.NoOfRows) {
            const res2 = await model.ContainerRowDetails.create({
                RowNumber: item.RowNumber,
                RowHeight: item.RowHeight,
                NoOfColumns: item.NoOfColumns.length,
                ContainerTableID: res1.ID
            });

            for (const item1 of item.NoOfColumns) {
                colNumber++;
                console.log("ID ", res1.ID, "   ", res2.ID);
                await model.ContainerColumnDetails.create({
                    Width: item1.Width,
                    ContainerTableID: res1.ID,
                    ContainerRowDetailsTableID: res2.ID,
                    ColumnNumber: colNumber
                });
            }
        }

        return res.send({ success: true });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const containerDetailsFunc = async (req: Request, res: Response) => {
    try {
        const { containerID } = req.body;
        const container = await model.Container.findAll({
            where: {
                ID: containerID
            }
        });
        const containerDetails = { ...container[0].dataValues, row: [] };
        const rowDetails = await model.ContainerRowDetails.findAll({
            where: {
                ContainerTableID: containerID
            },
            order: [["RowNumber", "ASC"]]
        });
        for (const row of rowDetails) {
            const { ID: rowID } = row.dataValues;
            const columnDetails = await model.ContainerColumnDetails.findAll({
                where: {
                    ContainerTableID: containerID,
                    ContainerRowDetailsTableID: rowID
                },
                order: [["ColumnNumber", "ASC"]]
            });
            const rowObj = { ...row.dataValues, col: columnDetails };
            containerDetails.row.push(rowObj);
        }
        return res.send({ success: true, data: containerDetails });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const cardValues = async (req: Request, res: Response) => {
    try {
        const { type, shopID } = req.query;
        switch (type) {
            case "TotalNumberOfProduct": {
                const count = await model.ProductInventory.count({
                    where: {
                        ShopDetailID: shopID
                    }
                });
                return res.send({ success: true, data: count });
            }
            case "LowStockCount": {
                const count = await model.ProductInventory.count({
                    where: {
                        ShopDetailID: shopID,
                        [Op.and]: Sequelize.literal('"Quantity" <= "LowStockCount"')
                    }
                });
                return res.send({ success: true, data: count });
            }
            case "AvaliableSpacePercentage": {
                // const containerItems = await model.Container.findAll({
                //     where: {
                //         ShopDetailID: shopID
                //     },
                //     attributes: ["Height", "Width"]
                // });
                // if (!containerItems || containerItems.length === 0) return res.send({ success: true, data: 0 });
                // const productItems = await model.ProductInventory.findAll({
                //     where: {
                //         ShopDetailID: shopID
                //     },
                //     attributes: ["productHeight", "productWidth"]
                // });
                // let totalArea: number = 0;
                // containerItems.forEach((containerItem: any) => {
                //     const item = containerItem.dataValues;
                //     totalArea += (Number(item.Height) * Number(item.Width));
                // });
                // let prdArea: number = 0;
                // productItems.forEach((productItem: any) => {
                //     const item = productItem.dataValues;
                //     prdArea += (Number(item.productHeight) * Number(item.productWidth));
                // })
                // const precentage = ((totalArea - prdArea) / totalArea) * 100;
                return res.send({ success: true, data: "100" });
            }
            case "TotalNumberOfContainer": {
                const count = await model.Container.count({
                    where: {
                        ShopDetailID: shopID
                    }
                });
                return res.send({ success: true, data: count });
            }
            case "ShopStatus": {
                return res.send({ success: true, data: "NA" });
            }
            case "CostToBuyProduct": {
                let sum = await model.ProductInventory.sum('CostToBuy', {
                    where: {
                        ShopDetailID: shopID
                    }
                });
                if (!sum) sum = 0;
                return res.send({ success: true, data: sum });
            }
            case "ExpectedProfit": {
                let sum = await model.ProductInventory.sum('PerItemProfit', {
                    where: {
                        ShopDetailID: shopID
                    }
                });
                if (!sum) sum = 0;
                return res.send({ success: true, data: sum });
            }
            case "NumberOfItemExpired": {
                const currentDate: Date = new Date();
                const count = await model.ProductInventory.count({
                    where: {
                        ShopDetailID: shopID,
                        ExpiredDate: {
                            [Op.lt]: currentDate
                        }
                    }
                });
                return res.send({ success: true, data: count });
            }
        }
        return res.send({ success: false, data: "Not Found!!!!" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getLastSevenDaysSellRecord = async (req: Request, res: Response) => {
    try {
        const { shopID } = req.body;
        const currentDate = new Date();
        const lastSevenDaysRecordCount: Array<number> = [];
        for (let index = 0; index < 7; index++) {
            let cnt = await model.SellRecords.count({
                where: {
                    ShopDetailID: shopID,
                    createdAt: currentDate
                }
            });
            if (!cnt) cnt = 0;
            lastSevenDaysRecordCount.push(cnt);
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return res.send({ success: true, data: lastSevenDaysRecordCount });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const crudNotesFunc = async (req: Request, res: Response) => {
    try {
        const { type, shopID, ID, addObj } = req.body;
        switch (type) {
            case "Add": {
                await model.ShopNotes.create({
                    ...addObj,
                    ShopDetailID: shopID
                });
                return res.send({ success: true });
            }
            case "Delete": {
                if (!ID) return res.send({ success: false, data: "Didn't try to delete all records" });
                await model.ShopNotes.destroy({
                    where: {
                        ID
                    }
                });
                return res.send({ success: true });
            }
            case "Get": {
                const response = await model.ShopNotes.findAll({
                    where: {
                        ShopDetailID: shopID
                    }
                });
                return res.send({ success: true, data: response });
            }
        };
        return res.send({ success: false, data: "Type Not Match" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getData = async (req: Request, res: Response) => {
    try {
        const { ShopID, type, CategoryType, SubCategoryType, ProductName, ContainerName, searchStr } = req.body;
        if (!type) {
            const data = await model.ProductInventory.findAll({
                where: {
                    ShopDetailID: ShopID
                }
            });
            return res.send({ success: true, data });
        } else if (type === "filter") {
            let filterObj: Record<string, string> = {};
            if (CategoryType) filterObj = { CategoryType };
            if (SubCategoryType) filterObj = { ...filterObj, SubCategoryType };
            if (ProductName) filterObj = { ...filterObj, ProductName };
            if (ContainerName) filterObj = { ...filterObj, ContainerName };
            const data = await model.ProductInventory.findAll({
                where: {
                    ...filterObj
                }
            });
            return res.send({ success: true, data });
        } else if (type === "search") {
            const data = await model.ProductInventory.findAll({
                where: {
                    [Op.or]: [
                        { ProductName: { [Op.like]: `%${searchStr}%` } },
                        { CategoryType: { [Op.like]: `%${searchStr}%` } },
                        { Quantity: { [Op.like]: `%${searchStr}%` } },
                        { CostToBuy: { [Op.like]: `%${searchStr}%` } },
                        { PerItemProfit: { [Op.like]: `%${searchStr}%` } },
                        { ContainerName: { [Op.like]: `%${searchStr}%` } },
                        { RowNumber: { [Op.like]: `%${searchStr}%` } },
                        { ColumnNumber: { [Op.like]: `%${searchStr}%` } },
                        { Height: { [Op.like]: `%${searchStr}%` } },
                        { Width: { [Op.like]: `%${searchStr}%` } },
                        { Depth: { [Op.like]: `%${searchStr}%` } },
                        { LowStock: { [Op.like]: `%${searchStr}%` } },
                        { ExpiredDate: { [Op.like]: `%${searchStr}%` } },
                        { ProductImagesURL: { [Op.like]: `%${searchStr}%` } },
                        { ProductDescription: { [Op.like]: `%${searchStr}%` } },
                        { ProductPositionInfo: { [Op.like]: `%${searchStr}%` } }
                    ]
                }
            });
            return res.send({ success: true, data });
        }

    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const options = async (req: Request, res: Response) => {
    try {
        const { type, ShopID, ContainerID, RowID, CategoryType } = req.query;
        switch (type) {
            case "Container": {
                const response = await model.Container.findAll({
                    where: {
                        ShopDetailID: ShopID
                    },
                    attributes: ["Name", "ID"]
                });
                return res.send({ success: true, data: response });
            }
            case "RowNumber": {
                const response = await model.ContainerRowDetails.findAll({
                    where: {
                        ContainerTableID: ContainerID,
                    },
                    attributes: [
                        'RowNumber',
                        [Sequelize.fn('MIN', Sequelize.col('ID')), 'ID'], // or MAX
                    ],
                    group: ['RowNumber'],
                    raw: true,
                });
                return res.send({ success: true, data: response });
            }
            case "ColumnNumber": {
                const response = await model.ContainerColumnDetails.findAll({
                    where: {
                        ContainerTableID: ContainerID,
                        ContainerRowDetailsTableID: RowID
                    },
                    attributes: [
                        'ColumnNumber',
                        [Sequelize.fn('MIN', Sequelize.col('ID')), 'ID'], // or MAX
                    ],
                    group: ['ColumnNumber'],
                });
                return res.send({ success: true, data: response });
            }
            case "ContainerName": {
                const response = await model.ProductInventory.findAll({
                    where: {
                        ShopDetailID: ShopID
                    },
                    attributes: [Sequelize.fn("DISTINCT", Sequelize.col("ContainerName")), "ContainerName"]
                });
                return res.send({ success: true, data: response.map((item: any) => item.ContainerName) });
            }
            case "ProductName": {
                const response = await model.ProductInventory.findAll({
                    where: {
                        ShopDetailID: ShopID
                    },
                    attributes: [Sequelize.fn('DISTINCT', Sequelize.col("ProductName")), "ProductName"]
                });
                return res.send({ success: true, data: response.map((item: any) => item.ProductName) });
            }
            case "Category": {
                const response = await model.ProductInventory.findAll({
                    where: {
                        ShopDetailID: ShopID
                    },
                    attributes: [Sequelize.fn('DISTINCT', Sequelize.col("CategoryType")), "CategoryType"]
                });
                return res.send({ success: true, data: response.map((item: any) => item.CategoryType) });
            }
            case "SubCategory": {
                const response = await model.ProductInventory.findAll({
                    where: {
                        ShopDetailID: ShopID,
                        CategoryType
                    },
                    attributes: [Sequelize.fn('DISTINCT', Sequelize.col("SubCategoryType")), "SubCategoryType"]
                });
                return res.send({ success: true, data: response.map((item: any) => item.SubCategoryType) });
            }
        }
        return res.send({ success: false });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const containerDetailsAboutSpace = async (req: Request, res: Response) => {
    try {
        const { ShopID } = req.body;
        const containerDetails = await model.Container.findAll({
            where: {
                ShopDetailID: ShopID
            }
        });
        const data: Array<{ ContainerName: string, AvaliableSpace: number, ID: number }> = [];
        for (const containerDetail of containerDetails) {
            const { Height, Width, ID: containerID, Name: containerName } = containerDetail;
            const totalArea = Height * Width;
            let totalAreaOfProduct: number = 0;
            const productDetailsOnThisContainer = await model.ProductInventory.findAll({
                where: {
                    ContainerTableID: containerID,
                    ShopDetailID: ShopID
                }
            });
            for (const prdDetail of productDetailsOnThisContainer) {
                const { productHeight, productWidth } = prdDetail;
                const prdArea = productHeight * productWidth;
                totalAreaOfProduct += prdArea;
            }
            data.push({
                ContainerName: containerName,
                AvaliableSpace: ((totalArea - totalAreaOfProduct) / totalArea) * 100,
                ID: containerID
            });
        }
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);

    }
}

export const onePerticularContainerDetails = async (req: Request, res: Response) => {
    try {
        const { ID } = req.body;
        const containerDetails = await model.Container.findAll({
            where: {
                ID
            }
        });
        console.log(containerDetails);
        const containerRowDetails = await model.ContainerRowDetails.findAll({
            where: { ContainerTableID: ID }
        });
        const rows = [];
        for (const rowDetails of containerRowDetails) {
            const { ID: rowID, RowHeight } = rowDetails.dataValues;
            const rowObj: any = { height: RowHeight, cols: [] };
            const containerColumnDetails = await model.ContainerColumnDetails.findAll({
                where: {
                    ContainerTableID: ID,
                    ContainerRowDetailsTableID: rowID
                }
            });
            for (const colDetails of containerColumnDetails) {
                const { Width } = colDetails.dataValues;
                rowObj.cols.push(Width);
            }
            rows.push(rowObj);
        }
        const data = { ...containerDetails[0].dataValues, rows };
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const addProduct = async (req: Request, res: Response) => {
    try {
        const { ProductName, CategoryType, SubCategoryType, Quantity, CostToBuy, PerItemProfit, ContainerName, RowNumber, ColumnNumber, Height, Width, Depth, LowStock, ExpiredDate, ProductImagesURL, ProductDescription, ProductPositionInfo, ContainerTableID, ShopDetailID } = req.body;
        await model.ProductInventory.create({ ProductName, CategoryType, SubCategoryType, Quantity, CostToBuy, PerItemProfit, ContainerName, RowNumber, ColumnNumber, Height, Width, Depth, LowStock, ExpiredDate, ProductImagesURL, ProductDescription, ProductPositionInfo, ContainerTableID, ShopDetailID });

        return res.send({ success: true });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}