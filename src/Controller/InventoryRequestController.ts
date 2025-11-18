import { Request, Response } from "express";
import model from "../../Sequelize/model";
import { Op, Sequelize, where } from "sequelize";
import InventoryConfig from "../Config/InventoryConfig";
import moment from "moment";

export const addNewInventoryRequest = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { data } = req.body;
        data.Status = "New";
        await model.InventoryRequestTable.create(data);
        await model.InventoryRequestActivities.create({ Activity: "New" });
        return res.send({ success: true, data: "Successfully Added" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getInventoryRequest = async (req: Request, res: Response) => {
    try {
        const allData = await model.InventoryRequestTable.findAll();
        const newStatusData = await model.InventoryRequestTable.findAll({
            where: {
                Status: "New"
            }
        });
        const inProgressData = await model.InventoryRequestTable.findAll({
            where: {
                Status: "In-Progress"
            }
        });
        const holdData = await model.InventoryRequestTable.findAll({
            where: {
                Status: "Hold"
            }
        });
        const completeData = await model.InventoryRequestTable.findAll({
            where: {
                Status: "Complete"
            }
        });
        const rejectedData = await model.InventoryRequestTable.findAll({
            where: {
                Status: "Rejected"
            }
        });
        return res.send({
            success: true, data: {
                allData,
                newStatusData,
                inProgressData,
                holdData,
                completeData,
                rejectedData
            }
        });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getInventoryRequestByFilter = async (req: Request, res: Response) => {
    try {
        const { filterObj } = req.body;
        let data: any;
        const res1 = await model.InventoryRequestTable.findAll({
            where: {
                ...filterObj
            }
        });
        data = res1;
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getInventoryRequestSearch = async (req: Request, res: Response) => {
    try {
        const { type, searchValue } = req.body;
        let data: any;
        let searchObj = [];
        for (const item of InventoryConfig.searchField) {
            searchObj.push({ [item]: { [Op.like]: `%${searchValue}%` } });
        }
        const response = await model.InventoryRequestTable.findAll({
            where: {
                [Op.or]: [...searchObj]
            }
        });
        data = response;
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getOption = async (req: Request, res: Response) => {
    try {
        const { val } = req.body ? req.body : { val: undefined };
        const { type } = req.query;
        let data: any;
        switch (type) {
            case "ProductName": {
                const queryOptions: any = {
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('ProductName')), 'ProductName']
                    ],
                    raw: true
                };
                if (val !== undefined && val !== null) {
                    queryOptions.where = { Status: val };
                }
                const res = await model.InventoryRequestTable.findAll(queryOptions);
                data = res.map((item: any) => item.ProductName).filter((item: any) => {
                    return item
                });;
                break;
            };
            case "ProductType": {
                const queryOptions: any = {
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('ProductType')), 'ProductType']
                    ],
                    raw: true
                };
                if (val !== undefined && val !== null) {
                    queryOptions.where = { Status: val };
                }
                const res = await model.InventoryRequestTable.findAll(queryOptions);
                data = res.map((item: any) => item.ProductType).filter((item: any) => {
                    return item
                });;
                break;
            }
            case "ClientCompany": {
                const queryOptions: any = {
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('ClientCompany')), 'ClientCompany']
                    ],
                    raw: true
                };
                if (val !== undefined && val !== null) {
                    queryOptions.where = { Status: val };
                }
                const res = await model.InventoryRequestTable.findAll(queryOptions);
                data = res.map((item: any) => item.ClientCompany).filter((item: any) => {
                    return item
                });;
                break;
            }
            case "RequestDate": {
                const queryOptions: any = {
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('RequestDate')), 'RequestDate']
                    ],
                    raw: true
                };
                if (val !== undefined && val !== null) {
                    queryOptions.where = { Status: val };
                }
                const res = await model.InventoryRequestTable.findAll(queryOptions);
                data = res.map((item: any) => item.RequestDate).filter((item: any) => {
                    return item
                });
                break;
            }
            case "RequestBy": {
                const queryOptions: any = {
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('RequestBy')), 'RequestBy']
                    ],
                    raw: true
                };
                if (val !== undefined && val !== null) {
                    queryOptions.where = { Status: val };
                }
                const res = await model.InventoryRequestTable.findAll(queryOptions);
                data = res.map((item: any) => item.RequestBy).filter((item: any) => {
                    return item
                });;
                break;
            }
        }
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const updateInventoryRequest = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        switch (data.Status) {
            case "In-Progress": {
                await model.InventoryRequestTable.update({
                    AddtionalNote: data.AddtionalNote,
                    Cost: data.Cost,
                    ExpectedReachedDate: data.ExpectedReachedDate,
                    ClientName: data.ClientName,
                    ClientPhone: data.ClientPhone,
                    ClientCompany: data.ClientCompany,
                    OrderDate: data.OrderDate,
                    Status: "In-Progress",
                }, {
                    where: {
                        ID: data.ID
                    }
                });
                await model.InventoryRequestActivities.create({ Activity: "Order Placed" });
                break;
            };
            case "Hold": {
                await model.InventoryRequestTable.update({
                    HoldReason: data.HoldReason,
                    Status: "Hold"
                }, {
                    where: {
                        ID: data.ID
                    }
                });
                break;
            }
            case "Rejected": {
                await model.InventoryRequestTable.update({
                    RejectedReason: data.RejectedReason,
                    Status: "Rejected"
                }, {
                    where: {
                        ID: data.ID
                    }
                });
                break;
            }
        }

        return res.send({ success: true, data: "Successfully Updated" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const orderReceived = async (req: Request, res: Response) => {
    try {
        const { Id } = req.body.data;
        await model.InventoryRequestTable.update({
            Status: "Complete",
            ActualReachedDate: new Date()
        }, {
            where: {
                ID: Id
            }
        })
        return res.send({ success: true, data: "Successfully Updated" });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const getActivitiesDetails = async (req: Request, res: Response) => {
    try {
        const { type } = req.body;
        const currentDate: Date = new Date();
        let result: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const targetDate = new Date(currentDate);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            const data = await model.InventoryRequestActivities.findAll({
                where: {
                    Activity: type,
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                }
            });
            result = { ...result, [moment(currentDate).format("DD MMM")]: data.length };
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return res.send({ success: true, data: result });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const deleteInventoryRequest = async (req: Request, res: Response) => {
    try {
        const { ID } = req.body;
        await model.InventoryRequestTable.destroy({
            where: {
                ID: ID
            }
        });
        await model.InventoryRequestActivities.create({ Activity: "Delete" });
        return res.send({ success: true });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const inventoryCalendarDetails = async (req: Request, res: Response) => {
    try {
        const data = await model.InventoryRequestTable.findAll({
            where: {
                Status: {
                    [Op.not]: "New"
                }
            }
        })
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}