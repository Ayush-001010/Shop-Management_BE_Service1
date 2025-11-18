import { getAnalytics, getCardValues, getOptions } from "../Controller/InventoryController";

const express = require("express");
const route = express.Router();


route.post("/GetAnalytics", getAnalytics);
route.post("/getCardValue", getCardValues);
route.post("/options",getOptions);

export default route;