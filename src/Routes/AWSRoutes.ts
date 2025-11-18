import { getURLForUploadFileInS3 } from "../Controller/AWSController";

const express = require("express");
const route = express.Router();

route.post("/getURLForUploadFileInS3", getURLForUploadFileInS3);

export default route;