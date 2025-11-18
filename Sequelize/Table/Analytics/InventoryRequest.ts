import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const InventoryCountRequest = sequelize.define("inventoryRequestCountTable" , {
    ID : {
        autoIncrement :  true,
        primaryKey : true ,
        type : DataTypes.INTEGER
    },
    Year : DataTypes.STRING,
    Month : DataTypes.STRING,
    RequestMake : DataTypes.INTEGER
});

export default InventoryCountRequest;