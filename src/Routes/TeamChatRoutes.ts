import express from 'express';
import { createGroup, createNewPinnedChat, deleteChats, getOldMessage, getPersonsDetails, removePinnedChat } from '../Controller/TeamChatController';
const route = express.Router();

route.post("/getPersonsDetails", getPersonsDetails);
route.post("/pinnedChat", createNewPinnedChat);
route.post("/unPinnedChat", removePinnedChat);
route.post("/getOldMessage", getOldMessage);
route.post("/createGroup", createGroup);
route.post("/deleteChats", deleteChats);

export default route;