import { addContainer, addProduct, cardValues, containerDetailsAboutSpace, containerDetailsFunc, crudNotesFunc, getData, getLastSevenDaysSellRecord, onePerticularContainerDetails, options } from "../Controller/ShopInventoryController";

const express = require("express");
const route = express.Router();

route.post("/containerDetails", containerDetailsFunc);
route.post("/cardValues", cardValues);
route.post("/sellRecordCount", getLastSevenDaysSellRecord);
route.post("/crudNotes", crudNotesFunc);
route.post("/getData", getData);
route.post("/addContainer", addContainer);
route.post("/getOption", options);
route.post("/getContainerDetailsAboutSpace", containerDetailsAboutSpace);
route.post("/onePerticularContainerDetails", onePerticularContainerDetails);
route.post("/addProduct", addProduct);

export default route;