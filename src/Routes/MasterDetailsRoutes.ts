import { getProductTypes } from "../Controller/MasterDetailsController";

const express = require("express");
const route = express.Router();

route.post("/productType",getProductTypes);

export default route;