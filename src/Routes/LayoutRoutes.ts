import { checkLayoutIsAlreadyPresent, createLayout, getSectionSchemaAndItemSchema } from "../Controller/LayoutController";

const express = require("express");
const route = express.Router();


route.post("/createLayout", createLayout);
route.post("/checkLayoutIsAlreadyPresent", checkLayoutIsAlreadyPresent);
route.post("/getSectionSchemaAndItemSchema", getSectionSchemaAndItemSchema);

export default route;