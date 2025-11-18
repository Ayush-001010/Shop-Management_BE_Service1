import { Request, Response } from "express";
import model from "../../Sequelize/model";
import { Op, Sequelize, where } from "sequelize";
import moment from "moment";
import { getFileURL } from "../AWS/aws-operation";

export const getPersonsDetails = async (req: Request, res: Response) => {
    try {
        const { userID } = req.body;
        const currentUserDetails = await model.UserMaster.findAll({
            where: {
                ID: userID
            }
        })
        if (!currentUserDetails || currentUserDetails.length === 0) {
            return res.send({ success: false, message: "User Not Found" });
        }
        const organizationID = currentUserDetails[0].organizationdetailstableID;
        const userDetails = await model.UserMaster.findAll({
            where: {
                organizationdetailstableID: organizationID,
                ID: {
                    [Op.ne]: userID
                }
            }
        });
        const personDetails: Array<any> = [];
        const pinnedPersonDetails: Array<any> = [];
        for (const user of userDetails) {
            const personID = user.dataValues.ID;
            const isPinned = (await model.PinnedChat.findAll({
                where: {
                    UserID: userID,
                    PersonPingID: personID
                }
            })).length > 0;
            if (isPinned) {
                pinnedPersonDetails.push(user);
            } else {
                personDetails.push(user);
            }
        }
        const groupDetails = await model.ChatGroup.findAll({
            where: {
                UserID: {
                    [Op.like]: `%${userID}%`
                }
            }
        })
        for (const group of groupDetails) {
            const groupID = group.dataValues.ID;
            const isPinned = (await model.PinnedChat.findAll({
                where: {
                    UserID: userID,
                    GroupPingID: groupID
                }
            })).length > 0;
            if (isPinned) {
                pinnedPersonDetails.push(group);
            } else {
                personDetails.push(group);
            }
        }
        for (const item of personDetails) {
            if (item.userImageURL)
                item.userImageURL = await getFileURL(item.userImageURL);
        }
        for (const item of pinnedPersonDetails) {
            if (item.userImageURL)
                item.userImageURL = await getFileURL(item.userImageURL);
        }
        return res.send({ success: true, data: { personDetails, pinnedPersonDetails } });
    } catch (error) {
        console.log("Error ", error);
        return res.send({ success: false });
    }
}

export const createNewPinnedChat = async (req: Request, res: Response) => {
    try {
        const { userID, pinnedPerosnID, groupID } = req.body;
        await model.PinnedChat.create({
            UserID: userID,
            PersonPingID: pinnedPerosnID,
            GroupPingID: groupID
        });
        return res.send({ success: true });
    } catch (error) {
        console.log("Error ", error);
        return res.send({ success: false });
    }
}

export const removePinnedChat = async (req: Request, res: Response) => {
    try {
        const { userID, pinnedPerosnID, groupID } = req.body;
        await model.PinnedChat.destroy({
            where: {
                UserID: userID,
                PersonPingID: pinnedPerosnID,
                GroupPingID: groupID
            }
        });
        return res.send({ success: true });
    } catch (error) {
        console.log("Error ", error);
        return res.send({ success: false });
    }
}

export const getOldMessage = async (req: Request, res: Response) => {
    try {
        const { currentUser, selectedPerson, groupID } = req.body;
        console.log(currentUser, selectedPerson, groupID)
        const data = await model.ChatMessage.findAll({
            where: {
                [Op.or]: [
                    { SendBy: currentUser ? currentUser : null, RecivedBy: selectedPerson ? selectedPerson : null },
                    { SendBy: selectedPerson ? selectedPerson : null, RecivedBy: currentUser ? currentUser : null },
                    { GroupID: groupID ? groupID : -1 }
                ],
                [Op.and]: {
                    [Op.or]: [
                        {
                            DeletedBy: {
                                [Op.notLike]: `%||${currentUser}||%`
                            }
                        },
                        {
                            DeletedBy: null
                        }
                    ]
                }
            },
            order: [["createdAt", "ASC"]]
        });
        await model.ChatMessage.update({ IsMessageNotSend: false }, {
            where: {
                [Op.or]: [
                    { SendBy: selectedPerson ? selectedPerson : null, RecivedBy: currentUser ? currentUser : null },
                    { GroupID: groupID ? groupID : -1 }
                ],
                IsMessageNotSend: true
            }
        });
        for (const item of data) {
            item.FileURL = await getFileURL(item.FileURL);
        }
        return res.send({ success: true, data });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const createGroup = async (req: Request, res: Response) => {
    try {
        const { groupName, userIDs, GroupCreateBy, GroupAbout, GroupImageURL } = req.body;
        const userIDsStr = "||" + userIDs.join("||") + "||";
        const groupID = groupName.replace(/\s+/g, '') + (moment().format("DD-MM-YYYY_HH:mm:ss"));
        await model.ChatGroup.create({
            GroupName: groupName,
            UserID: userIDsStr,
            GroupID: groupID,
            GroupCreateBy,
            GroupAbout,
            GroupImageURL
        });
        return res.send({ success: true });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}

export const deleteChats = async (req: Request, res: Response) => {
    try {
        const { type, currentUser, selectedPerson, ChatID } = req.body;
        switch (type) {
            case "All": {
                await model.ChatMessage.update({
                    DeletedBy: Sequelize.literal(`CONCAT(IFNULL(DeletedBy, ''), '||${currentUser}||')`)
                }, {
                    where: {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { SendBy: currentUser },
                                    { RecivedBy: selectedPerson }
                                ]
                            },
                            {
                                [Op.and]: [
                                    { SendBy: selectedPerson },
                                    { RecivedBy: currentUser }
                                ]
                            }
                        ]
                    }
                });
                return res.send({ success: true });
            }
            case "DeleteByMe": {
                await model.ChatMessage.update({
                    DeletedBy: Sequelize.literal(`CONCAT(IFNULL(DeletedBy, ''), '||${currentUser}||')`)
                }, {
                    where: {
                        ID: ChatID
                    }
                })
                return res.send({ success: true });
            }
            case "DeleteByEveryone": {
                await model.ChatMessage.update({
                    DeletedBy: Sequelize.literal(`CONCAT(IFNULL(DeletedBy, ''), '||${currentUser}||||${selectedPerson}||')`)
                }, {
                    where: {
                        ID: ChatID
                    }
                })
                return res.send({ success: true });
            }
        }
        return res.send({ success: false });
    } catch (error) {
        console.log("Error  ", error);
        return res.send({ success: false });
    }
}