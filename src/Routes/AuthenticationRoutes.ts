import { createAccount, getOption, IsUserAlreadyLoggedIn, userDetailChange, userDetails, userSignIn } from "../Controller/AuthenticationController";

const express = require("express");
const route = express.Router();

route.post("/option", getOption);
route.post("/createAccount", createAccount);
route.post("/getUserDetails", userDetails);
route.post("/signIn", userSignIn);
route.post("/isUserAlreadyLoggedIn", IsUserAlreadyLoggedIn);
route.post("/userDetailChange", userDetailChange);

export default route;