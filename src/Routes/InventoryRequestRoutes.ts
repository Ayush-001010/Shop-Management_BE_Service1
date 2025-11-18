import { addNewInventoryRequest, deleteInventoryRequest, getActivitiesDetails, getInventoryRequest, getInventoryRequestByFilter, getInventoryRequestSearch, getOption, inventoryCalendarDetails, orderReceived, updateInventoryRequest } from "../Controller/InventoryRequestController";

const express = require("express");
const route = express.Router();

route.post("/add", addNewInventoryRequest);
route.post("/get", getInventoryRequest);
route.post("/option", getOption);
route.post("/filterData", getInventoryRequestByFilter);
route.post("/search", getInventoryRequestSearch);
route.post("/update", updateInventoryRequest);
route.post("/complete", orderReceived);
route.post("/activity", getActivitiesDetails);
route.post("/delete", deleteInventoryRequest);
route.post("/calendar", inventoryCalendarDetails);

export default route;