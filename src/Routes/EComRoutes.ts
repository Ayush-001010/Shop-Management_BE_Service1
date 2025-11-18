import { getCategoryAndSubCategory, getCategoryAndSubCategoryForLandingPage, getImageURL, getSearchItems, getSubCategoryItem } from "../Controller/EComController";

const express = require("express");
const route = express.Router();

route.post("/getCategoryAndSubCategory", getCategoryAndSubCategory);
route.post("/getImageURL", getImageURL);
route.post("/getCategoryAndSubCategoryForLandingPage", getCategoryAndSubCategoryForLandingPage);
route.post("/getSubCategoryItem", getSubCategoryItem);
route.post("/getSearchItems", getSearchItems);

export default route;