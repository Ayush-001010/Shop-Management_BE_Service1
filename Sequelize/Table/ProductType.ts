import {  DataTypes } from "sequelize";
import sequelize from "../dbConfig";

const ProductType = sequelize.define("ProductTypeTable" , {
    ID : {
        primaryKey : true,
        type : DataTypes.INTEGER,
        autoIncrement:true
    },
    ProductType : {
        type : DataTypes.STRING
    }
});

export default ProductType;