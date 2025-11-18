import { getImage } from "../Controller/ImageController";

const express = require("express");
const route = express.Router();

route.get("/:name", getImage);

export default route;