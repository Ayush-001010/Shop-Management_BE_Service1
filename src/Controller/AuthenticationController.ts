import { Request, Response } from "express";
import model from "../../Sequelize/model";
import { Sequelize, where } from "sequelize";
import ICreateAccountInterface from "../Config/Interface/CreateAccountInterface";
import jwt from "jsonwebtoken";
import { getFileURL } from "../AWS/aws-operation";

export const getOption = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;
        console.log("Type   ", type);
        switch (type) {
            case "Product_Type": {
                const data = await model.ProductType.findAll({
                    attributes: ["ProductType"]
                });
                return res.send({ success: true, data });
            };
            case "City_Master": {
                const { dependentValue } = req.body;
                const data = await model.CityMaster.findAll({
                    where: {
                        State: dependentValue
                    },
                    attributes: ["City", "State"]
                });
                return res.send({ success: true, data });
            }
            case "State_Master": {
                const data = await model.CityMaster.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('State')), 'State']
                    ]
                });
                return res.send({ success: true, data });
            }
        }
        return res.send({ success: false });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const createAccount = async (req: Request, res: Response) => {
    try {
        const data: ICreateAccountInterface = req.body;
        console.log(data);
        const organization = await model.OrganizationDetails.create({
            organizationId: data.organizationId,
            OrganizationName: data.OrganizationName,
            FounderName: data.FounderName,
            ContactPhoneNumber: data.ContactPhoneNumber,
            ContactEmail: data.ContactEmail,
            NumberOfShops: data.NumberOfShops,
            FoundingDate: data.FoundingDate,
            OrganizationType: data.OrganizationType,
            ProductCategories: data.ProductCategories?.join(",")
        });
        for (const shopDetails of data?.shopDetails) {
            await model.ShopDetails.create({
                shopname: shopDetails.shopname,
                state: shopDetails.state,
                city: shopDetails.city,
                address: shopDetails.address,
                shopcontactnumber: shopDetails.shopcontactnumber,
                shopemail: shopDetails.shopemail,
                shoptype: shopDetails.shoptype,
                leaseownername: shopDetails.leaseownername,
                leasestartdate: shopDetails.leasestartdate,
                leaseenddate: shopDetails.leaseenddate,
                organizationdetailstableID: organization.ID
            })
            await model.UserMaster.create({
                userName: shopDetails.userName,
                password: shopDetails.userpassword,
                userEmail: shopDetails.userEmail,
                isAdmin: false,
                organizationdetailstableID: organization.ID
            })
        }
        await model.UserMaster.create({
            userName: data.adminDetails.adminUserName,
            password: data.adminDetails.adminPassword,
            userEmail: data.adminDetails.adminUserEmail,
            isAdmin: true,
            organizationdetailstableID: organization.ID
        })
        return res.send({ success: true });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const userDetails = async (req: Request, res: Response) => {
    try {
        const { userEmail } = req.body;
        const userDetails = await model.UserMaster.findAll({
            where: {
                userEmail
            }
        });
        if (userDetails.length === 0) return res.send({ success: false });
        const { organizationdetailstableID } = userDetails[0];
        const organizationDetails = await model.OrganizationDetails.findAll({
            where: {
                ID: organizationdetailstableID
            }
        });
        const shopDetails = await model.ShopDetails.findAll({
            where: {
                organizationdetailstableID
            }
        });
        userDetails[0].userImageURL = await getFileURL(userDetails[0].userImageURL);
        return res.send({
            success: true, data: {
                OrganizationDetails: organizationDetails[0],
                ShopDetails: shopDetails,
                userDetails: userDetails[0]
            }
        });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const userSignIn = async (req: Request, res: Response) => {
    try {
        const { userEmail, password } = req.body;
        const data = await model.UserMaster.findAll({
            where: {
                userEmail,
                password
            }
        });
        if (data.length > 0) {
            const token = jwt.sign({
                ID: data[0].dataValues.ID,
                userEmail: data[0].dataValues.Email,
            }, process.env.jwtTokenSecretKey || "");
            console.log("Token ", token);
            res.cookie("Auth_Cookie", token, {
                httpOnly: true,
                secure: false
            });
            return res.send({ success: true, data: data[0] });
        } else {
            return res.send({ success: false });
        }
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const IsUserAlreadyLoggedIn = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.Auth_Cookie || "";
        const value = jwt.verify(token, process.env.jwtTokenSecretKey || "");
        if (!value) {
            return res.send({ success: false });
        }
        console.log("Value  ", value);
        const { ID }: any = value
        console.log("ID ", ID);
        const userDetail = await model.UserMaster.findAll({
            where: {
                ID
            }
        })
        return res.send({ success: true, data: userDetail[0] });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const userDetailChange = async (req: Request, res: Response) => {
    try {
        const { ID, userName, userImage, userPassword, About } = req.body;
        await model.UserMaster.update({
            userName,
            userImageURL: userImage,
            About
        }, {
            where: {
                ID
            }
        });
        if (userPassword.length > 0) {
            await model.UserMaster.update({
                userPassword,
            }, {
                where: {
                    ID
                }
            });
        }
        return res.send({ success: true });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}