import { getCategoryAndSubCategory, getCategoryAndSubCategoryForLandingPage, getFilterItems, getImageURL, getItems, getItemSchema, getSearchItems, getSubCategoryItem } from "../Controller/EComController";

const express = require("express");
const route = express.Router();

route.post("/getCategoryAndSubCategory", getCategoryAndSubCategory);
route.post("/getImageURL", getImageURL);
route.post("/getCategoryAndSubCategoryForLandingPage", getCategoryAndSubCategoryForLandingPage);
route.post("/getSubCategoryItem", getSubCategoryItem);
route.post("/getSearchItems", getSearchItems);
route.post("/getFilterItems", getFilterItems);
route.post("/getItems", getItems);
route.post("/getItemSchema", getItemSchema);

export default route;