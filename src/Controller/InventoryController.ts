import { Request, Response } from "express";
import model from "../../Sequelize/model";
import CommonConfig from "../Config/CommonConfig";
import { Sequelize, where } from "sequelize";

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const { type, organizationID } = req.body;
        switch (type) {
            case "Inventory Request": {
                const currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                const data: Array<{ Month: string, year: string, value: number }> = [];
                for (let index = 0; index < 12; index++) {
                    const response = await model.InventoryCountRequest.findAll({
                        where: {
                            Month: CommonConfig.month[currentMonth],
                            Year: currentYear,
                            organizationdetailstableID: organizationID
                        }
                    });
                    if (response.length > 0) {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: response[0].RequestMake });
                    } else {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: 0 });
                    }
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentYear--;
                        currentMonth = 11;
                    }
                }
                return res.send({ success: true, data });
            }
            case "Amount Purcase": {
                const currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                const data: Array<{ Month: string, year: string, value: number }> = [];
                for (let index = 0; index < 12; index++) {
                    const response = await model.AmountPurcase.findAll({
                        where: {
                            Month: CommonConfig.month[currentMonth],
                            Year: currentYear,
                            organizationdetailstableID: organizationID
                        }
                    });
                    if (response.length > 0) {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: response[0].Money });
                    } else {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: 0 });
                    }
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentYear--;
                        currentMonth = 11;
                    }
                }
                return res.send({ success: true, data });
            }
            case "Total Sales": {
                const currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                const data: Array<{ Month: string, year: string, value: number }> = [];
                for (let index = 0; index < 12; index++) {
                    const response = await model.SalesCount.findAll({
                        where: {
                            Month: CommonConfig.month[currentMonth],
                            Year: currentYear,
                            organizationdetailstableID: organizationID
                        }
                    });
                    if (response.length > 0) {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: response[0].Count });
                    } else {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: 0 });
                    }
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentYear--;
                        currentMonth = 11;
                    }
                }
                return res.send({ success: true, data });
            }
            case "Profit": {
                const currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                const data: Array<{ Month: string, year: string, value: number }> = [];
                for (let index = 0; index < 12; index++) {
                    const response = await model.Profit.findAll({
                        where: {
                            Month: CommonConfig.month[currentMonth],
                            Year: currentYear,
                            organizationdetailstableID: organizationID
                        }
                    });
                    if (response.length > 0) {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: response[0].Profit });
                    } else {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: 0 });
                    }
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentYear--;
                        currentMonth = 11;
                    }
                }
                return res.send({ success: true, data });
            }
            case "Loss": {
                const currentDate = new Date();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                const data: Array<{ Month: string, year: string, value: number }> = [];
                for (let index = 0; index < 12; index++) {
                    const response = await model.Loss.findAll({
                        where: {
                            Month: CommonConfig.month[currentMonth],
                            Year: currentYear,
                            organizationdetailstableID: organizationID
                        }
                    });
                    if (response.length > 0) {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: response[0].Loss });
                    } else {
                        data.push({ Month: CommonConfig.month[currentMonth], year: currentYear.toString(), value: 0 });
                    }
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentYear--;
                        currentMonth = 11;
                    }
                }
                return res.send({ success: true, data });
            }
        }
        return res.send({ success: false });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getCardValues = async (req: Request, res: Response) => {
    try {
        const { type, organizationID } = req.body;

        switch (type) {
            case "NoOfShops": {
                const data = await model.ShopDetails.count({
                    where: {
                        organizationdetailstableID: organizationID
                    }
                });
                return res.send({ success: true, data });
            }
            case "NoOfProductCategory": {
                // const data = await model.ShopDetails
                return res.send({ success: true, data: 0 });
            }
        }
        return res.send({ success: false });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getOptions = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        switch (type) {
            case "shopname": {
                const data = await model.ShopDetails.findAll({
                    attributes: [Sequelize.fn("DISTINCT", Sequelize.col("shopname")), "shopname"]
                })
                return res.send({ success: true, data: data.map((item: any) => item.shopname) });
            }
            case "shoptype": {
                const data = await model.ShopDetails.findAll({
                    attributes: [Sequelize.fn("DISTINCT", Sequelize.col("shoptype")), "shoptype"]
                })
                return res.send({ success: true, data: data.map((item: any) => item.shoptype) });
            }
        }
        return res.send({ success: false });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}